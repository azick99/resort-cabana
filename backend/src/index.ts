import express from "express";
import cors from "cors";
import path from "path";
import minimist from "minimist";
import { parseMap } from "./mapParser";
import { BookingService } from "./bookingService";
import { BookRequest } from "./types";

const argv = minimist(process.argv.slice(2));
const mapPath = path.resolve(argv.map ?? "map.ascii");
const bookingsPath = path.resolve(argv.bookings ?? "bookings.json");

console.log(`📍 Map path:      ${mapPath}`);
console.log(`📍 Bookings path: ${bookingsPath}`);

const mapData = parseMap(mapPath);
const bookingService = new BookingService(bookingsPath);

const cabanaIds = new Set(
  mapData.tiles
    .filter((t) => t.cabanaId !== null)
    .map((t) => t.cabanaId as string),
);

const app = express();

// ── Allow requests from any frontend URL ─────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.FRONTEND_URL ?? "", // production frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl) or from allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
  }),
);

app.use(express.json());

// ── Routes (same as before) ───────────────────────────────────────────────────
app.get("/api/map", (_req, res) => {
  const bookedIds = bookingService.getBookedIds();
  const tiles = mapData.tiles.map((tile) => ({
    ...tile,
    available: tile.cabanaId !== null && !bookedIds.has(tile.cabanaId),
    booked: tile.cabanaId !== null && bookedIds.has(tile.cabanaId),
  }));
  res.json({ rows: mapData.rows, cols: mapData.cols, tiles });
});

app.get("/api/cabanas", (_req, res) => {
  const bookedIds = bookingService.getBookedIds();
  const cabanas = mapData.tiles
    .filter((t) => t.type === "W")
    .map((t) => ({
      cabanaId: t.cabanaId,
      row: t.row,
      col: t.col,
      available: !bookedIds.has(t.cabanaId!),
      booked: bookedIds.has(t.cabanaId!),
    }));
  res.json(cabanas);
});

app.post("/api/book", (req, res) => {
  const { cabanaId, room, guestName } = req.body as BookRequest;

  if (!cabanaId || !room || !guestName) {
    res
      .status(400)
      .json({ error: "cabanaId, room, and guestName are all required." });
    return;
  }
  if (!cabanaIds.has(cabanaId)) {
    res.status(400).json({ error: "Cabana not found on the map." });
    return;
  }
  if (!bookingService.isValidGuest(room, guestName)) {
    res
      .status(401)
      .json({ error: "Room number and guest name do not match our records." });
    return;
  }

  const result = bookingService.bookCabana(cabanaId, room, guestName);
  if (!result.success) {
    res.status(409).json({ error: result.error });
    return;
  }

  res.json({
    message: `Cabana booked successfully! Enjoy, ${guestName}! 🏖️`,
    cabanaId,
  });
});

// ── Use PORT from environment (Render sets this automatically) ────────────────
const PORT = process.env.PORT ?? 5050;
app.listen(PORT, () => {
  console.log(`\n🚀 Resort API running at http://localhost:${PORT}`);
});

export { app, bookingService, cabanaIds };

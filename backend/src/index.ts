import express from 'express';
import cors from 'cors';
import path from 'path';
import minimist from 'minimist';
import { parseMap } from './mapParser';
import { BookingService } from './bookingService';
import { BookRequest } from './types';

// ── 1. Parse CLI arguments ───────────────────────────────────────────────────
// Example: npx ts-node src/index.ts --map ../map.ascii --bookings ../bookings.json
const argv = minimist(process.argv.slice(2));
const mapPath      = path.resolve(argv.map      ?? 'map.ascii');
const bookingsPath = path.resolve(argv.bookings ?? 'bookings.json');

// ── 2. Load map and bookings ─────────────────────────────────────────────────
console.log(`📍 Map path:      ${mapPath}`);
console.log(`📍 Bookings path: ${bookingsPath}`);

const mapData        = parseMap(mapPath);
const bookingService = new BookingService(bookingsPath);

// Collect all valid cabana IDs from the parsed map
const cabanaIds = new Set(
  mapData.tiles
    .filter(t => t.cabanaId !== null)
    .map(t => t.cabanaId as string)
);

console.log(`🗺️  Map loaded: ${mapData.rows} rows × ${mapData.cols} cols`);
console.log(`🏖️  Cabanas found: ${cabanaIds.size}`);

// ── 3. Setup Express ─────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ── 4. Routes ────────────────────────────────────────────────────────────────

// GET /api/map
// Returns the full map grid with availability info for each tile
app.get('/api/map', (_req, res) => {
  const bookedIds = bookingService.getBookedIds();

  const tiles = mapData.tiles.map(tile => ({
    ...tile,
    // only cabana tiles have availability
    available: tile.cabanaId !== null && !bookedIds.has(tile.cabanaId),
    booked:    tile.cabanaId !== null &&  bookedIds.has(tile.cabanaId),
  }));

  res.json({
    rows:  mapData.rows,
    cols:  mapData.cols,
    tiles,
  });
});

// GET /api/cabanas
// Returns only the cabana tiles with availability — useful for sidebar/legend
app.get('/api/cabanas', (_req, res) => {
  const bookedIds = bookingService.getBookedIds();

  const cabanas = mapData.tiles
    .filter(t => t.type === 'W')
    .map(t => ({
      cabanaId:  t.cabanaId,
      row:       t.row,
      col:       t.col,
      available: !bookedIds.has(t.cabanaId!),
      booked:    bookedIds.has(t.cabanaId!),
    }));

  res.json(cabanas);
});

// POST /api/book
// Books a cabana for a guest
app.post('/api/book', (req, res) => {
  const { cabanaId, room, guestName } = req.body as BookRequest;

  // ── Validation steps ───────────────────────────────────────────────────────

  // 1. Check all fields are present
  if (!cabanaId || !room || !guestName) {
    res.status(400).json({ 
      error: 'cabanaId, room, and guestName are all required.' 
    });
    return;
  }

  // 2. Check the cabana actually exists on the map
  if (!cabanaIds.has(cabanaId)) {
    res.status(400).json({ 
      error: 'Cabana not found on the map.' 
    });
    return;
  }

  // 3. Check the guest credentials match
  if (!bookingService.isValidGuest(room, guestName)) {
    res.status(401).json({ 
      error: 'Room number and guest name do not match our records.' 
    });
    return;
  }

  // 4. Try to book
  const result = bookingService.bookCabana(cabanaId, room, guestName);

  if (!result.success) {
    // 409 Conflict = resource already taken
    res.status(409).json({ error: result.error });
    return;
  }

  // ── Success ────────────────────────────────────────────────────────────────
  res.json({
    message:  `Cabana booked successfully! Enjoy, ${guestName}! 🏖️`,
    cabanaId,
  });
});

// ── 5. Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 5050;
app.listen(PORT, () => {
  console.log(`\n🚀 Resort API running at http://localhost:${PORT}`);
  console.log(`   GET  /api/map`);
  console.log(`   GET  /api/cabanas`);
  console.log(`   POST /api/book\n`);
});

// Export for tests
export { app, bookingService, cabanaIds };
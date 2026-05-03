// ── Tile types matching the ASCII map symbols ──────────────────────────────
export type TileType = "W" | "p" | "#" | "c" | ".";

// ── Which path image to use for '#' tiles ─────────────────────────────────
export type PathAsset =
  | "arrowStraight"
  | "arrowCornerSquare"
  | "arrowCrossing"
  | "arrowSplit"
  | "arrowEnd";

// ── A single tile on the map ───────────────────────────────────────────────
export interface Tile {
  row: number;
  col: number;
  type: TileType;
  cabanaId: string | null; // e.g. "cabana-6-3", only for W tiles
  pathAsset?: PathAsset; // only for # tiles
  rotation?: number; // 0 | 90 | 180 | 270 — for rotating path images
}

// ── Full map response ──────────────────────────────────────────────────────
export interface MapData {
  rows: number;
  cols: number;
  tiles: Tile[];
}

// ── A guest from bookings.json ─────────────────────────────────────────────
export interface Guest {
  room: string;
  guestName: string;
}

// ── A cabana booking stored in memory ─────────────────────────────────────
export interface CabanaBooking {
  cabanaId: string;
  room: string;
  guestName: string;
  bookedAt: string;
}

// ── Request body for POST /api/book ───────────────────────────────────────
export interface BookRequest {
  cabanaId: string;
  room: string;
  guestName: string;
}

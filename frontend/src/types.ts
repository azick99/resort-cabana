// Matches the symbols in map.ascii
export type TileType = 'W' | 'p' | '#' | 'c' | '.';

// Which path image to show for '#' tiles
export type PathAsset =
  | 'arrowStraight'
  | 'arrowCornerSquare'
  | 'arrowCrossing'
  | 'arrowSplit'
  | 'arrowEnd';

// A single tile — matches what the API sends back
export interface Tile {
  row:       number;
  col:       number;
  type:      TileType;
  cabanaId:  string | null;
  pathAsset?: PathAsset;
  rotation?:  number;       // 0 | 90 | 180 | 270
  available: boolean;
  booked:    boolean;
}

export interface MapData {
  rows:  number;
  cols:  number;
  tiles: Tile[];
}

// What we send to POST /api/book
export interface BookRequest {
  cabanaId:  string;
  room:      string;
  guestName: string;
}
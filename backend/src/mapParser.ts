import fs from "fs";
import { MapData, Tile, TileType, PathAsset } from "./types";

// ── Manual path tile definitions ─────────────────────────────────────────────
// Key: "row-col", Value: { asset, rotation }
const MANUAL_PATH_TILES: Record<
  string,
  { asset: PathAsset; rotation: number }
> = {
  // I manually mapped all the '#' tiles in the ASCII map to the correct path asset and rotation based on visual inspection. This is a one-time effort to ensure the map looks correct, since the ASCII map doesn't encode this information. For any '#' tile not listed here, the parser will default to a straight horizontal path.

  // ── Row 2 ──────────────────────────────────────────────────────────────────
  "2-1": { asset: "arrowCornerSquare", rotation: 0 }, // ┌
  "2-3": { asset: "arrowSplit", rotation: 90 }, // ┬
  "2-6": { asset: "arrowSplit", rotation: -90 }, // ┴
  "2-11": { asset: "arrowCrossing", rotation: 0 }, // +
  "2-18": { asset: "arrowSplit", rotation: 180 }, // ┤

  // ── Row 3 ──────────────────────────────────────────────────────────────────
  "3-3": { asset: "arrowStraight", rotation: 0 }, // │
  "3-11": { asset: "arrowStraight", rotation: 0 }, // │
  "3-18": { asset: "arrowStraight", rotation: 0 }, // │

  // ── Row 4 ──────────────────────────────────────────────────────────────────
  "4-3": { asset: "arrowStraight", rotation: 0 }, // │
  "4-8": { asset: "arrowStraight", rotation: 0 }, // │
  "4-11": { asset: "arrowStraight", rotation: 0 }, // │
  "4-13": { asset: "arrowStraight", rotation: 0 }, // │
  "4-15": { asset: "arrowStraight", rotation: 0 }, // │
  "4-18": { asset: "arrowStraight", rotation: 0 }, // │

  // ── Row 5 ──────────────────────────────────────────────────────────────────
  "5-1": { asset: "arrowCornerSquare", rotation: 90 },
  "5-3": { asset: "arrowSplit", rotation: -90 },
  "5-5": { asset: "arrowSplit", rotation: -90 },
  "5-10": { asset: "arrowSplit", rotation: -90 },
  "5-11": { asset: "arrowCrossing", rotation: 0 },
  "5-16": { asset: "arrowSplit", rotation: 90 },
  "5-17": { asset: "arrowSplit", rotation: -90 },
  "5-18": { asset: "arrowCornerSquare", rotation: -90 },

  // ── Row 6 ──────────────────────────────────────────────────────────────────
  "6-1": { asset: "arrowStraight", rotation: 0 },
  "6-11": { asset: "arrowStraight", rotation: 0 },
  "6-16": { asset: "arrowStraight", rotation: 0 },

  // ── Row 7 ──────────────────────────────────────────────────────────────────
  "7-1": { asset: "arrowStraight", rotation: 0 },
  "7-7": { asset: "arrowSplit", rotation: 0 },
  "7-11": { asset: "arrowCornerSquare", rotation: -90 },
  "7-16": { asset: "arrowCornerSquare", rotation: 0 },
  "7-17": { asset: "arrowSplit", rotation: -90 },
  "7-18": { asset: "arrowCornerSquare", rotation: 180 },

  // ── Row 8 ──────────────────────────────────────────────────────────────────
  "8-1": { asset: "arrowStraight", rotation: 0 },
  "8-7": { asset: "arrowStraight", rotation: 0 },
  "8-18": { asset: "arrowStraight", rotation: 0 },

  // ── Row 9 ──────────────────────────────────────────────────────────────────
  "9-1": { asset: "arrowSplit", rotation: 0 },
  "9-5": { asset: "arrowSplit", rotation: -90 },
  "9-7": { asset: "arrowSplit", rotation: -90 },
  "9-14": { asset: "arrowSplit", rotation: -90 },
  "9-16": { asset: "arrowSplit", rotation: -90 },
  "9-18": { asset: "arrowCornerSquare", rotation: -90 },

  // ── Row 10 rest rows ──────────────────────────────────────────────────────────────────
  "10-1": { asset: "arrowStraight", rotation: 0 },
  "11-1": { asset: "arrowStraight", rotation: 0 },
  "12-1": { asset: "arrowStraight", rotation: 0 },
  "13-1": { asset: "arrowStraight", rotation: 0 },
  "14-1": { asset: "arrowStraight", rotation: 0 },
  "15-1": { asset: "arrowStraight", rotation: 0 },

  "16-1": { asset: "arrowCornerSquare", rotation: 0 },
  "16-16": { asset: "arrowEnd", rotation: 90 },
};

// ── Main export ───────────────────────────────────────────────────────────────
export function parseMap(filePath: string): MapData {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Map file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.replace(/\r/g, "").split("\n");
  const cleanLines =
    lines[lines.length - 1].trim() === "" ? lines.slice(0, -1) : lines;

  const rows = cleanLines.length;
  const cols = Math.max(...cleanLines.map((l: string) => l.length));
  const tiles: Tile[] = [];

  for (let r = 0; r < cleanLines.length; r++) {
    const line = cleanLines[r];
    for (let c = 0; c < line.length; c++) {
      const ch = line[c] as TileType;

      let pathAsset: PathAsset | undefined;
      let rotation: number | undefined;

      if (ch === "#") {
        const key = `${r}-${c}`;
        const manual = MANUAL_PATH_TILES[key];

        if (manual) {
          // ✅ Use manual definition
          pathAsset = manual.asset;
          rotation = manual.rotation;
        } else {
          // ⚠️ Fallback to straight horizontal for unmapped tiles
          pathAsset = "arrowStraight";
          rotation = 90;
        }
      }

      tiles.push({
        row: r,
        col: c,
        type: ch,
        cabanaId: ch === "W" ? `cabana-${r}-${c}` : null,
        pathAsset,
        rotation,
      });
    }
  }

  return { rows, cols, tiles };
}

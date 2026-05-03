import fs from "fs";
import path from "path";
import { MapData, Tile, TileType, PathAsset } from "./types";

interface Neighbors {
  up: boolean;
  right: boolean;
  down: boolean;
  left: boolean;
}

function isPath(ch: string | undefined): boolean {
  return ch === "#";
}

function getNeighbors(lines: string[], r: number, c: number): Neighbors {
  return {
    up: isPath(lines[r - 1]?.[c]),
    right: isPath(lines[r]?.[c + 1]),
    down: isPath(lines[r + 1]?.[c]),
    left: isPath(lines[r]?.[c - 1]),
  };
}

function getPathAsset(n: Neighbors): { asset: PathAsset; rotation: number } {
  const { up, right, down, left } = n;
  const count = [up, right, down, left].filter(Boolean).length;

  if (count === 4) {
    return { asset: "arrowCrossing", rotation: 0 };
  }

  if (count === 3) {
    if (!up) return { asset: "arrowSplit", rotation: 180 };
    if (!right) return { asset: "arrowSplit", rotation: 90 };
    if (!down) return { asset: "arrowSplit", rotation: 0 };
    return { asset: "arrowSplit", rotation: 270 };
  }

  if (count === 2) {
    if (up && down) return { asset: "arrowStraight", rotation: 0 };
    if (left && right) return { asset: "arrowStraight", rotation: 90 };
    if (right && down) return { asset: "arrowCornerSquare", rotation: 0 };
    if (left && down) return { asset: "arrowCornerSquare", rotation: 90 };
    if (left && up) return { asset: "arrowCornerSquare", rotation: 180 };
    return { asset: "arrowCornerSquare", rotation: 270 };
  }

  if (up) return { asset: "arrowEnd", rotation: 180 };
  if (right) return { asset: "arrowEnd", rotation: 270 };
  if (down) return { asset: "arrowEnd", rotation: 0 };
  if (left) return { asset: "arrowEnd", rotation: 90 };

  return { asset: "arrowEnd", rotation: 0 };
}

export function parseMap(filePath: string): MapData {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Map file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");

  const lines = content.replace(/\r/g, "").split("\n");

  // Remove trailing empty line
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
        const neighbors = getNeighbors(cleanLines, r, c);
        const result = getPathAsset(neighbors);
        pathAsset = result.asset;
        rotation = result.rotation;
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

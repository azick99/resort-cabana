import type { Tile } from "../types";

// Size of each tile in pixels
const TILE_SIZE = 40;

// Which overlay image to show on top of the parchment background
function getOverlayImage(tile: Tile): string | null {
  switch (tile.type) {
    case "W":
      return "/assets/cabana.png";
    case "p":
      return "/assets/textureWater.png";
    case "c":
      return "/assets/houseChimney.png";
    case "#":
      return tile.pathAsset ? `/assets/${tile.pathAsset}.png` : null;
    case ".":
      return null; // just parchment, no overlay
    default:
      return null;
  }
}

interface Props {
  tile: Tile;
  onClick: (tile: Tile) => void;
}

export function MapTile({ tile, onClick }: Props) {
  const isClickable = tile.type === "W";
  const overlayImage = getOverlayImage(tile);
  const rotation = tile.rotation ?? 0;

  // Cabana status color overlay
  let cabanaOverlay = "transparent";
  if (tile.type === "W") {
    cabanaOverlay = tile.booked
      ? "rgba(200, 50, 50, 0.55)" // red = booked
      : "rgba(50, 180, 80, 0.35)"; // green = available
  }

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      data-testid={tile.cabanaId ? `tile-${tile.cabanaId}` : undefined}
      title={
        tile.type === "W"
          ? tile.booked
            ? `${tile.cabanaId} — Already booked`
            : `${tile.cabanaId} — Available! Click to book`
          : undefined
      }
      onClick={() => isClickable && onClick(tile)}
      onKeyDown={(e) => e.key === "Enter" && isClickable && onClick(tile)}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        position: "relative",
        cursor: isClickable ? "pointer" : "default",
        overflow: "hidden",
      }}
    >
      {/* ── Layer 1: parchment background (always shown) ────────────────── */}
      <img
        src="/assets/parchmentBasic.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* ── Layer 2: tile-specific image (rotated for path tiles) ────────── */}
      {overlayImage && (
        <img
          src={overlayImage}
          alt={tile.type}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: tile.type === "#" ? "cover" : "contain",
            transform: `rotate(${rotation}deg)`,
          }}
        />
      )}

      {/* ── Layer 3: green/red tint for cabana availability ──────────────── */}
      {tile.type === "W" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: cabanaOverlay,
            transition: "background 0.3s",
          }}
        />
      )}

      {/* ── Layer 4: hover glow effect for available cabanas ─────────────── */}
      {tile.type === "W" && !tile.booked && (
        <style>{`
          [data-testid="tile-${tile.cabanaId}"]:hover > div:last-child {
            box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.6);
          }
          [data-testid="tile-${tile.cabanaId}"]:hover {
            transform: scale(1.1);
            z-index: 10;
          }
        `}</style>
      )}
    </div>
  );
}

export { TILE_SIZE };

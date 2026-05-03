import type { Tile } from "../types";

const TILE_SIZE = 40;

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

  // Build class names
  const tileClass = [
    "tile",
    isClickable ? "tile--clickable" : "",
    tile.type === "W" && tile.available ? "tile--available" : "",
    tile.type === "W" && tile.booked ? "tile--booked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={tileClass}
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
    >
      {/* Layer 1 — parchment background */}
      <img
        className="tile-layer"
        src="/assets/parchmentBasic.png"
        alt=""
      />

      {/* Layer 2 — tile image (rotation only stays inline — it's dynamic) */}
      {overlayImage && (
        <img
          className={`tile-layer ${tile.type !== "#" ? "tile-layer--contain" : ""}`}
          src={overlayImage}
          alt={tile.type}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      )}

      {/* Layer 3 — green/red availability tint for cabanas */}
      {tile.type === "W" && <div className="tile-status" />}
    </div>
  );
}

export { TILE_SIZE };

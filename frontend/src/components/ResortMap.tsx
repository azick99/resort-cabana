import { useCallback, useEffect, useState } from "react";
import { fetchMap } from "../api";
import type { MapData, Tile } from "../types";
import { MapTile, TILE_SIZE } from "./Tile";
import { Legend } from "./Legend";

export function ResortMap() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Phase 5: selected tile for booking modal
  const [selected, setSelected] = useState<Tile | null>(null);

  // Load the map from the API
  const loadMap = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMap();
      setMapData(data);
    } catch {
      setError("Could not load the resort map. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={centerStyle}>
        <p style={{ fontSize: 20, color: "#8b6a3e" }}>Loading resort map…</p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={centerStyle}>
        <p style={{ color: "#c0392b", fontSize: 18 }}>{error}</p>
        <button
          onClick={loadMap}
          style={retryBtnStyle}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!mapData) return null;

  // ── Build 2D grid from flat tile list ─────────────────────────────────────
  // Some rows in the ASCII map are shorter than cols — we fill with undefined
  const grid: (Tile | undefined)[][] = Array.from(
    { length: mapData.rows },
    () => Array(mapData.cols).fill(undefined),
  );
  mapData.tiles.forEach((tile) => {
    grid[tile.row][tile.col] = tile;
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "max-content", margin: "0 auto" }}>
      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "12px",
          color: "#5a3e1b",
          fontSize: 28,
          letterSpacing: 1,
          textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
        }}
      >
        🌴 Resort Cabana Map
      </h1>

      {/* Legend */}
      <Legend />

      {/* Map grid */}
      <div
        data-testid="resort-map"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${mapData.cols}, ${TILE_SIZE}px)`,
          gap: 1,
          padding: 12,
          background: "rgba(255,255,255,0.3)",
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          overflowX: "auto",
        }}
      >
        {grid.map((row, r) =>
          row.map((tile, c) =>
            tile ? (
              <MapTile
                key={`${r}-${c}`}
                tile={tile}
                onClick={setSelected}
              />
            ) : (
              // Empty cell — just show parchment for cells beyond line length
              <div
                key={`${r}-${c}`}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  overflow: "hidden",
                }}
              >
                <img
                  src="/assets/parchmentBasic.png"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ),
          ),
        )}
      </div>

      {/* Debug info — remove before final submission */}
      <p
        style={{
          textAlign: "center",
          marginTop: 8,
          color: "#8b6a3e",
          fontSize: 12,
        }}
      >
        {mapData.tiles.filter((t) => t.type === "W" && t.available).length}{" "}
        cabanas available
        {" · "}
        {mapData.tiles.filter((t) => t.type === "W" && t.booked).length} booked
        {selected && ` · Selected: ${selected.cabanaId}`}
      </p>

      {/* Phase 5: BookingModal will go here */}
      {selected && (
        <p style={{ textAlign: "center", marginTop: 8, color: "#2980b9" }}>
          🚧 Booking modal coming in Phase 5! (clicked: {selected.cabanaId},
          booked: {String(selected.booked)})
        </p>
      )}
    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────────────────────
const centerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  gap: 12,
};

const retryBtnStyle: React.CSSProperties = {
  padding: "8px 20px",
  background: "#e67e22",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 15,
};

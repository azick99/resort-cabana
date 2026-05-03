import { useCallback, useEffect, useState } from "react";
import { fetchMap } from "../api";
import type { MapData, Tile } from "../types";
import { MapTile, TILE_SIZE } from "./Tile";
import { Legend } from "./Legend";
import { BookingModal } from "./BookingModal";

export function ResortMap() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selected, setSelected] = useState<Tile | null>(null);

  // ── Group loading/error into one state object ─────────────────────────────
  const [fetchState, setFetchState] = useState({
    loading: true,
    error: null as string | null,
  });

  const loadMap = useCallback(async () => {
    setFetchState({ loading: true, error: null });
    try {
      const data = await fetchMap();
      setMapData(data);
      setFetchState({ loading: false, error: null });
    } catch {
      setFetchState({
        loading: false,
        error: "Could not load the resort map. Is the backend running?",
      });
    }
  }, []);

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (fetchState.loading) {
    return (
      <div className="resort-map-center">
        <p className="resort-map-loading">Loading resort map…</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (fetchState.error) {
    return (
      <div className="resort-map-center">
        <p className="resort-map-error">{fetchState.error}</p>
        <button
          className="retry-btn"
          onClick={loadMap}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!mapData) return null;

  // ── Build 2D grid ─────────────────────────────────────────────────────────
  const grid: (Tile | undefined)[][] = Array.from(
    { length: mapData.rows },
    () => Array(mapData.cols).fill(undefined),
  );
  mapData.tiles.forEach((tile) => {
    grid[tile.row][tile.col] = tile;
  });

  const availableCount = mapData.tiles.filter(
    (t) => t.type === "W" && t.available,
  ).length;
  const bookedCount = mapData.tiles.filter(
    (t) => t.type === "W" && t.booked,
  ).length;

  return (
    <div className="resort-map-container">
      <h1 className="resort-map-title">🌴 Resort Cabana Map</h1>

      <Legend />

      {/* gridTemplateColumns stays inline — it's dynamic */}
      <div
        className="resort-map-grid"
        data-testid="resort-map"
        style={{
          gridTemplateColumns: `repeat(${mapData.cols}, ${TILE_SIZE}px)`,
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
              <div
                key={`${r}-${c}`}
                className="tile"
              >
                <img
                  className="tile-layer"
                  src="/assets/parchmentBasic.png"
                  alt=""
                />
              </div>
            ),
          ),
        )}
      </div>

      <p className="resort-map-stats">
        🟢 {availableCount} available · 🔴 {bookedCount} booked
      </p>

      {selected && (
        <BookingModal
          tile={selected}
          onClose={() => setSelected(null)}
          onBooked={() => {
            setSelected(null);
            loadMap();
          }}
        />
      )}
    </div>
  );
}

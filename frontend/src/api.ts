import type { MapData, BookRequest } from "./types";

// Uses Vite env variable — falls back to localhost
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

// Fetch the full map with availability info
export async function fetchMap(): Promise<MapData> {
  const res = await fetch(`${BASE}/api/map`);
  if (!res.ok) throw new Error("Failed to load map");
  return res.json();
}

// Send a booking request
export async function bookCabana(
  body: BookRequest,
): Promise<{ message: string; cabanaId: string }> {
  const res = await fetch(`${BASE}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Booking failed");
  return data;
}

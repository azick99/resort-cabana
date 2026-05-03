import { useState } from "react";
import { bookCabana } from "../api";
import type { Tile } from "../types";
import { Overlay } from "./Overlay";

interface Props {
  tile: Tile;
  onClose: () => void;
  onBooked: () => void;
}

// ── useState objects ──────────────────────────────────────────────────────────
interface FormState {
  room: string;
  guestName: string;
}

interface BookingStatus {
  loading: boolean;
  error: string | null;
  confirmed: boolean;
  confirmMsg: string;
}

export function BookingModal({ tile, onClose, onBooked }: Props) {
  const [form, setForm] = useState<FormState>({
    room: "",
    guestName: "",
  });

  const [status, setStatus] = useState<BookingStatus>({
    loading: false,
    error: null,
    confirmed: false,
    confirmMsg: "",
  });

  // ── Already booked ────────────────────────────────────────────────────────
  if (tile.booked) {
    return (
      <Overlay onClose={onClose}>
        <div className="modal-card">
          <div className="modal-icon modal-icon--large">🚫</div>
          <h2 className="modal-title">Cabana Unavailable</h2>
          <p className="modal-subtitle">
            Sorry, <strong>{tile.cabanaId}</strong> is already booked.
          </p>
          <p className="modal-subtitle">
            Please select a different cabana from the map.
          </p>
          <div
            className="modal-actions"
            style={{ justifyContent: "center" }}
          >
            <button
              className="modal-btn modal-btn--back"
              onClick={onClose}
            >
              Back to Map
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (status.confirmed) {
    return (
      <Overlay onClose={onBooked}>
        <div className="modal-card">
          <div className="modal-icon modal-icon--large">🏖️</div>
          <h2 className="modal-title modal-title--success">
            Booking Confirmed!
          </h2>
          <p className="modal-subtitle">{status.confirmMsg}</p>

          <div className="modal-booking-details">
            <p>
              🏖️ <strong>Cabana:</strong> {tile.cabanaId}
            </p>
            <p>
              🏠 <strong>Room:</strong> {form.room}
            </p>
            <p>
              👤 <strong>Guest:</strong> {form.guestName}
            </p>
          </div>

          <button
            className="modal-btn modal-btn--success"
            onClick={onBooked}
          >
            ✓ Back to Map
          </button>
        </div>
      </Overlay>
    );
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.room.trim() || !form.guestName.trim()) {
      setStatus((prev) => ({ ...prev, error: "Please fill in both fields." }));
      return;
    }

    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await bookCabana({
        cabanaId: tile.cabanaId!,
        room: form.room.trim(),
        guestName: form.guestName.trim(),
      });

      setStatus((prev) => ({
        ...prev,
        loading: false,
        confirmed: true,
        confirmMsg: res.message,
      }));
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Booking failed.",
      }));
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon">🏖️</div>
          <h2 className="modal-title">Book a Cabana</h2>
          <p className="modal-subtitle">
            Cabana <strong>{tile.cabanaId}</strong>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="modal-field">
            <label className="modal-label">Room Number</label>
            <input
              className="modal-input"
              data-testid="input-room"
              type="text"
              value={form.room}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, room: e.target.value }))
              }
              placeholder="e.g. 101"
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Guest Name</label>
            <input
              className="modal-input"
              data-testid="input-name"
              type="text"
              value={form.guestName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, guestName: e.target.value }))
              }
              placeholder="e.g. Alice Smith"
            />
          </div>

          {status.error && (
            <p
              className="modal-error"
              role="alert"
            >
              ⚠️ {status.error}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--cancel"
              onClick={onClose}
              disabled={status.loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn--book"
              disabled={status.loading}
            >
              {status.loading ? "Booking…" : "Book Now 🏖️"}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  );
}

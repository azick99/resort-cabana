#!/usr/bin/env bash
set -e

# ── Default file paths ────────────────────────────────────────────────────────
MAP="map.ascii"
BOOKINGS="bookings.json"

# ── Parse --map and --bookings arguments ──────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case \$1 in
    --map)      MAP="\$2";      shift 2 ;;
    --bookings) BOOKINGS="\$2"; shift 2 ;;
    *) echo "❌ Unknown argument: \$1"; exit 1 ;;
  esac
done

# ── Install dependencies ──────────────────────────────────────────────────────
echo "📦 Installing backend dependencies..."
cd backend && npm install --silent && cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install --silent && cd ..

# ── Start backend ─────────────────────────────────────────────────────────────
echo "🏨  Starting backend (map=$MAP, bookings=$BOOKINGS)..."
cd backend
npx ts-node src/index.ts --map "../$MAP" --bookings "../$BOOKINGS" &
BACKEND_PID=$!
cd ..

# ── Wait for backend to be ready ──────────────────────────────────────────────
echo "⏳  Waiting for backend to start..."
sleep 3

# ── Start frontend ────────────────────────────────────────────────────────────
echo "🌴  Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅  Resort app is live!"
echo "   🌐 Frontend: http://localhost:5173"
echo "   🔌 API:      http://localhost:5050"
echo ""
echo "Press Ctrl+C to stop both servers."

# ── Graceful shutdown on Ctrl+C ───────────────────────────────────────────────
trap "echo '🛑 Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
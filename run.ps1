param(
  [string]$map      = "map.ascii",
  [string]$bookings = "bookings.json"
)

# ── Install dependencies ──────────────────────────────────────────────────────
Write-Host "📦 Installing backend dependencies..."
Set-Location backend
npm install --silent
Set-Location ..

Write-Host "📦 Installing frontend dependencies..."
Set-Location frontend
npm install --silent
Set-Location ..

# ── Start backend in a new terminal window ────────────────────────────────────
Write-Host "🏨  Starting backend (map=$map, bookings=$bookings)..."
$backendCmd = "npx ts-node src/index.ts --map `"../$map`" --bookings `"../$bookings`""
Start-Process "cmd.exe" -ArgumentList "/k cd backend && $backendCmd" -WindowStyle Normal

# ── Wait for backend to be ready ──────────────────────────────────────────────
Write-Host "⏳  Waiting for backend to start..."
Start-Sleep -Seconds 3

# ── Start frontend in a new terminal window ───────────────────────────────────
Write-Host "🌴  Starting frontend..."
Start-Process "cmd.exe" -ArgumentList "/k cd frontend && npm run dev" -WindowStyle Normal

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "✅  Resort app is live!"
Write-Host "   🌐 Frontend: http://localhost:5173"
Write-Host "   🔌 API:      http://localhost:5050"
Write-Host ""
Write-Host "Close the backend and frontend windows to stop the servers."
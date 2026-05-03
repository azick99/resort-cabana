# AI Workflow

## Tools Used
- **Claude (Anthropic)** — primary assistant for architecture, 
  code generation, debugging, and explanations
- **VS Code Copilot** — inline completions while typing

---

## How I Used It

I worked **phase by phase**, using Claude as a pair programmer.
Each phase had a clear goal, and I reviewed and tested the output
before moving on.

---

## Phases & Key Prompts

### Phase 1 — Project Setup
> "Set up a TypeScript monorepo with an Express backend and 
> React Vite frontend for a cabana booking app. Show me the 
> folder structure and all config files."

### Phase 2 — Map Parser
> "Write a TypeScript function that reads an ASCII map file 
> where W=cabana, p=pool, #=path, c=chalet, .=empty. For each 
> "#" tile, look at its 4 neighbors and decide which path image 
> to use (straight, corner, T-split, crossing, dead-end) and 
> what rotation angle to apply."

### Phase 3 — Booking Service & API
> "Write an Express API with 3 endpoints: GET /api/map, 
> GET /api/cabanas, POST /api/book. Bookings stored in memory. 
> Validate that room + guestName match a guest in bookings.json."

### Phase 4 — Frontend Map
> "Render the map as a CSS grid. Each tile has 3 layers: 
> parchment background, tile image, and green/red tint for 
> cabana availability. Use the real asset images."

### Phase 5 — Booking Modal
> "Create a booking modal with 3 screens: unavailable notice, 
> booking form, and confirmation. Group state into useState 
> objects. Extract Overlay into its own component. All styles 
> go in index.css."

### Phase 6 — Tests
> "Write Jest + Supertest tests for the backend covering map 
> parsing, booking logic, and all API endpoints. Write Vitest + 
> Testing Library tests for BookingModal and ResortMap covering 
> all user interactions."

### Phase 7 — Deliverables
> "Write a clean README with setup instructions, API docs, 
> design decisions. Write a run.sh that starts both servers 
> and accepts --map and --bookings flags."

---

## Debugging Help

- Fixed Windows `\r\n` line endings breaking map parser
- Fixed `fs` not found — needed `@types/node` + tsconfig update  
- Fixed `import.meta.env` error — needed `vite-env.d.ts`
- Fixed `test` not in Vite config types — changed to `vitest/config`

---

## Total Prompts
Approximately **25-30 prompts** across all phases including 
follow-up questions and bug fixes.

## Honest Assessment
Claude generated the structure and boilerplate. I reviewed each 
file, tested it manually, fixed issues that came up in the real 
environment (Windows paths, TypeScript config), and asked 
follow-up questions to understand concepts I wasn't sure about.
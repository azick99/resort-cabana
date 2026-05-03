const ITEMS = [
  {
    image: "/assets/cabana.png",
    overlay: "rgba(50,180,80,0.35)",
    label: "Cabana — Available",
  },
  {
    image: "/assets/cabana.png",
    overlay: "rgba(200,50,50,0.55)",
    label: "Cabana — Booked",
  },
  { image: "/assets/textureWater.png", overlay: "transparent", label: "Pool" },
  { image: "/assets/arrowStraight.png", overlay: "transparent", label: "Path" },
  {
    image: "/assets/houseChimney.png",
    overlay: "transparent",
    label: "Chalet",
  },
  {
    image: "/assets/parchmentBasic.png",
    overlay: "transparent",
    label: "Empty space",
  },
];

export function Legend() {
  return (
    <div className="legend">
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className="legend-item"
        >
          <div className="legend-swatch">
            <img
              src={item.image}
              alt={item.label}
            />
            <div
              className="legend-swatch-overlay"
              style={{ background: item.overlay }}
            />
          </div>
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

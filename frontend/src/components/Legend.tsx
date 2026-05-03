const ITEMS = [
  {
    image: "/assets/cabana.png",
    bg: "rgba(50,180,80,0.35)",
    label: "Cabana — Available",
  },
  {
    image: "/assets/cabana.png",
    bg: "rgba(200,50,50,0.55)",
    label: "Cabana — Booked",
  },
  { image: "/assets/textureWater.png", bg: "transparent", label: "Pool" },
  { image: "/assets/arrowStraight.png", bg: "transparent", label: "Path" },
  { image: "/assets/houseChimney.png", bg: "transparent", label: "Chalet" },
  {
    image: "/assets/parchmentBasic.png",
    bg: "transparent",
    label: "Empty space",
  },
];

export function Legend() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        justifyContent: "center",
        marginBottom: "16px",
        padding: "10px 16px",
        background: "rgba(255,255,255,0.6)",
        borderRadius: 10,
        backdropFilter: "blur(4px)",
      }}
    >
      {ITEMS.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
          }}
        >
          {/* Tile preview */}
          <div
            style={{
              width: 28,
              height: 28,
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={item.image}
              alt={item.label}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Status overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: item.bg,
              }}
            />
          </div>
          <span style={{ color: "#5a4a3a", fontWeight: 500 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

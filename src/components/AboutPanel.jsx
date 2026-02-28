// ── ABOUT PANEL ───────────────────────────────
function AboutPanel() {
  return (
    <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: "70vw", height: "70vw", maxWidth: "700px", maxHeight: "700px",
        borderRadius: "50%", right: "-15vw", top: "50%", transform: "translateY(-50%)",
        background: "radial-gradient(circle, rgba(78,205,196,0.05) 0%, transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: "clamp(2.5rem,5vw,5rem)", top: 0, bottom: 0, width: "1px",
        background: "linear-gradient(to bottom, transparent, #1a3533 25%, #1a3533 75%, transparent)" }} />
      <div style={{ paddingLeft: "clamp(3.5rem,8vw,8rem)", paddingRight: "2rem", maxWidth: "720px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
          <div style={{ width: "28px", height: "1px", background: "#4ecdc4" }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.58rem", letterSpacing: "0.35em", color: "#4ecdc4", textTransform: "uppercase" }}>Digital Vape Destination</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(4rem,9.5vw,8.5rem)",
          lineHeight: 0.9, letterSpacing: "0.03em", color: "#e8eded", marginBottom: "2.5rem" }}>
          FIND<br/><span style={{ color: "#4ecdc4" }}>YOUR</span><br/>DRAW.
        </h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
          lineHeight: 1.9, color: "#3e5658", maxWidth: "430px", marginBottom: "3rem", fontWeight: 300 }}>
          MISTY bridges high-performance hardware with a refined sensory experience.
          Precision-engineered devices, artisanal e-liquids — all defined by clarity,
          quality, and the art of the cloud.
        </p>
        <div style={{ display: "flex", gap: "clamp(1.5rem,4vw,3.5rem)", flexWrap: "wrap" }}>
          {[["120+","Curated Devices"],["40+","Artisanal Liquids"],["4.9★","Avg. Rating"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#e8eded", lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: "#1e3032", textTransform: "uppercase", marginTop: "5px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: "-1rem", bottom: "-4rem", fontFamily: "'Bebas Neue',sans-serif",
        fontSize: "clamp(7rem,16vw,15rem)", color: "rgba(78,205,196,0.025)", lineHeight: 1,
        pointerEvents: "none", userSelect: "none", letterSpacing: "0.06em" }}>CLOUD</div>
    </div>
  );
}

export default AboutPanel;
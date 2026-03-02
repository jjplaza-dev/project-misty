import { useCallback, useEffect, useRef, useState } from "react";

function ProductsPanel({ cart }) {
  const [idx, setIdx] = useState(0);
  const [cardKey, setCardKey] = useState(0);
  const [slideDir, setSlideDir] = useState(0);
  const [bgInterp, setBgInterp] = useState(PRODUCTS[0].bg);
  const animRef = useRef(null);
  const fromBg = useRef(PRODUCTS[0].bg);
  const toBg = useRef(PRODUCTS[0].bg);

  const goTo = useCallback((next) => {
    if (next === idx) return;
    const d = next > idx ? 1 : -1;
    setSlideDir(d);

    fromBg.current = toBg.current;
    toBg.current = PRODUCTS[next].bg;
    cancelAnimationFrame(animRef.current);
    let start = null;
    const dur = 750;
    const tick = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      setBgInterp(lerpHex(fromBg.current, toBg.current, ease));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    setIdx(next);
    setCardKey(k => k + 1);
  }, [idx]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const prev = () => goTo(idx === 0 ? PRODUCTS.length - 1 : idx - 1);
  const next = () => goTo(idx === PRODUCTS.length - 1 ? 0 : idx + 1);

  const p = PRODUCTS[idx];
  const animName = slideDir >= 0 ? "pSlideR" : "pSlideL";

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes pSlideR { from { transform: translateX(55px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pSlideL { from { transform: translateX(-55px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {/* BG layers */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#050b0c" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: bgInterp }} />
      {/* Vignette — opaque dark at edges, transparent at center = color shows in middle */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "radial-gradient(ellipse 62% 58% at 50% 47%, transparent 0%, rgba(5,11,12,0.45) 52%, rgba(5,11,12,0.91) 100%)" }} />
      {/* Accent bloom */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: `radial-gradient(ellipse 38% 38% at 50% 47%, ${p.accent}22 0%, transparent 65%)`,
        transition: "background 0.7s ease" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 4, flex: 1, display: "flex", flexDirection: "column",
        padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,3.5rem)", minHeight: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0, marginBottom: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.3rem" }}>
              <div style={{ width: "20px", height: "1px", background: p.accent, transition: "background 0.5s" }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.3em", color: p.accent, textTransform: "uppercase", transition: "color 0.5s" }}>Collection 2026</span>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#e8eded", letterSpacing: "0.05em", lineHeight: 1 }}>The Arsenal</h2>
          </div>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.48rem", letterSpacing: "0.2em", color: "#152426", textTransform: "uppercase" }}>
            {String(idx+1).padStart(2,"0")} / {String(PRODUCTS.length).padStart(2,"0")}
          </span>
        </div>

        {/* Card */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", minHeight: 0 }}>
          <div key={cardKey} style={{ width: "100%", animation: `${animName} 0.35s cubic-bezier(0.16,1,0.3,1) forwards` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.5rem,4vw,5rem)", flexWrap: "wrap" }}>
              {/* Visual box */}
              <div style={{ flexShrink: 0, width: "clamp(120px,17vw,210px)", height: "clamp(120px,17vw,210px)",
                border: `1px solid ${p.accent}28`, display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", background: `radial-gradient(circle at center, ${p.accent}12 0%, transparent 70%)`,
                transition: "border-color 0.5s" }}>
                {["tl","tr","bl","br"].map(c => (
                  <div key={c} style={{
                    position: "absolute",
                    top: c[0]==="t"?0:"auto", bottom: c[0]==="b"?0:"auto",
                    left: c[1]==="l"?0:"auto", right: c[1]==="r"?0:"auto",
                    width: "10px", height: "10px",
                    borderTop: c[0]==="t"?`1px solid ${p.accent}90`:"none",
                    borderBottom: c[0]==="b"?`1px solid ${p.accent}90`:"none",
                    borderLeft: c[1]==="l"?`1px solid ${p.accent}90`:"none",
                    borderRight: c[1]==="r"?`1px solid ${p.accent}90`:"none",
                    transition: "border-color 0.5s",
                  }} />
                ))}
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.5rem,3vw,3rem)",
                  color: `${p.accent}20`, letterSpacing: "0.04em", lineHeight: 1.1, textAlign: "center",
                  padding: "0.3rem", transition: "color 0.5s" }}>{p.name}</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: "min(200px,100%)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.55rem" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.5rem", letterSpacing: "0.22em",
                    color: p.accent, border: `1px solid ${p.accent}35`, padding: "2px 8px", textTransform: "uppercase",
                    transition: "color 0.4s, border-color 0.4s" }}>{p.tag}</span>
                </div>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.2rem,4.5vw,4rem)",
                  color: "#e8eded", letterSpacing: "0.04em", lineHeight: 0.95, marginBottom: "0.85rem" }}>{p.name}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(0.72rem,1vw,0.86rem)",
                  color: "#3a5254", lineHeight: 1.85, fontWeight: 300, marginBottom: "1rem", maxWidth: "380px" }}>{p.sub}</p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
                  {p.specs.map(s => (
                    <span key={s} style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.47rem",
                      letterSpacing: "0.13em", color: "#253637", border: "1px solid #0d1e20", padding: "3px 8px", textTransform: "uppercase" }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", color: "#e8eded", letterSpacing: "0.05em" }}>{p.price}</span>
                  <button onClick={() => cart.add(p)}
                    style={{ background: `${p.accent}14`, border: `1px solid ${p.accent}45`, color: p.accent,
                      fontFamily: "'DM Mono',monospace", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase",
                      padding: "9px 22px", cursor: "pointer", transition: "all 0.25s" }}
                    onMouseEnter={e => { e.currentTarget.style.background=`${p.accent}26`; e.currentTarget.style.borderColor=p.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background=`${p.accent}14`; e.currentTarget.style.borderColor=`${p.accent}45`; }}
                  >Add to Cart</button>
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.45rem", color: "#152426", letterSpacing: "0.13em", textTransform: "uppercase", marginTop: "0.6rem" }}>{p.flavor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "1.2rem", paddingTop: "0.7rem" }}>
          <button onClick={prev}
            style={{ background: "none", border: `1px solid ${p.accent}35`, color: p.accent,
              width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "sans-serif", fontSize: "1rem", transition: "all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.background=`${p.accent}18`; e.currentTarget.style.borderColor=p.accent; }}
            onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.borderColor=`${p.accent}35`; }}
          >←</button>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {PRODUCTS.map((prod, i) => (
              <button key={i} onClick={() => goTo(i)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 3px", display: "flex", alignItems: "center" }}>
                <div style={{
                  width: i === idx ? "18px" : "5px", height: "5px", borderRadius: "3px",
                  background: i === idx ? prod.accent : "#0d1e20",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow: i === idx ? `0 0 10px ${prod.accent}70` : "none",
                }} />
              </button>
            ))}
          </div>

          <button onClick={next}
            style={{ background: "none", border: `1px solid ${p.accent}35`, color: p.accent,
              width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "sans-serif", fontSize: "1rem", transition: "all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.background=`${p.accent}18`; e.currentTarget.style.borderColor=p.accent; }}
            onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.borderColor=`${p.accent}35`; }}
          >→</button>
        </div>
      </div>
    </div>
  );
}

export default ProductsPanel;

function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function lerpHex(a, b, t) {
  const [r1,g1,b1] = hexToRgb(a), [r2,g2,b2] = hexToRgb(b);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

 const PRODUCTS = [
  { id: 1, name: "SPECTRE X", tag: "MOD", price: "$189", accent: "#4ecdc4", bg: "#0d2e2c",
    sub: "Variable-wattage mod with 200W burst power and precision temperature control housed in an aerospace-grade titanium shell.",
    specs: ["200W Burst", "Temp Control", "OLED Display", "USB-C Fast Charge"], flavor: "Titanium Shell · 21700 Cell" },
  { id: 2, name: "VEIL POD", tag: "POD SYSTEM", price: "$64", accent: "#a78bfa", bg: "#1a0d2e",
    sub: "Draw-activated pod system with an 800mAh internal cell and replaceable quad-mesh coil. Engineered for discretion and consistency.",
    specs: ["Draw Activated", "800mAh Cell", "Mesh Coil", "USB-C Charge"], flavor: "Matte Obsidian · 2ml Pod" },
  { id: 3, name: "MIRAGE 50", tag: "E-LIQUID", price: "$24", accent: "#34d399", bg: "#0a2218",
    sub: "Cool watermelon up front, crisp white grape mid-note, and a faint mint exhale that vanishes like morning fog. 50/50 VG/PG.",
    specs: ["50mg Nic Salt", "50/50 VG/PG", "30ml Bottle", "Multi-Use"], flavor: "Watermelon · White Grape · Mint" },
  { id: 4, name: "NOIR SERIES", tag: "E-LIQUID", price: "$28", accent: "#f59e0b", bg: "#1f1500",
    sub: "Smoked vanilla over dark caramel with a whisper of raw tobacco on the close. Designed for those who favour depth over brightness.",
    specs: ["35mg Nic Salt", "70/30 VG/PG", "30ml Bottle", "MTL/DTL"], flavor: "Vanilla · Dark Caramel · Tobacco" },
  { id: 5, name: "APEX COILS", tag: "ACCESSORY", price: "$18", accent: "#f43f5e", bg: "#200a0f",
    sub: "Quad-mesh heating element rated at 0.15Ω. Near-instant ramp time with even heat distribution for dense, flavour-forward clouds.",
    specs: ["0.15Ω Quad Mesh", "Pack of 4", "40-80W Range", "Spectre X Fit"], flavor: "Compatible: Spectre X · Drift Kit" },
  { id: 6, name: "DRIFT KIT", tag: "STARTER", price: "$49", accent: "#38bdf8", bg: "#001a2e",
    sub: "Everything to take your first draw with intention: a compact device, two pre-installed coils, and a 10ml sample of Mirage 50.",
    specs: ["Device Included", "2x Coils", "10ml Sample", "Gift-Ready Box"], flavor: "Complete Starter · Limited Stock" },
];
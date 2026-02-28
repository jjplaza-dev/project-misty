import React from 'react'

import { useState, useEffect, useRef, useCallback } from "react";
import ProductsPanel from './components/ProductsPanel';
import AboutPanel from './components/AboutPanel';
import BlogPanel from './components/BlogPanel';
import EventsPanel from './components/EventsPanel';

function useCart() {
  const [items, setItems] = useState([]);
  const add = (p) =>
    setItems((prev) => {
      const hit = prev.find((i) => i.id === p.id);
      return hit
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }];
    });
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const total = items.reduce((s, i) => s + parseFloat(i.price.replace("$", "")) * i.qty, 0);
  return { items, add, remove, total };
}

const NAV = [
  { id: "about",    label: "About",    icon: "◈" },
  { id: "products", label: "Products", icon: "◉" },
  { id: "blog",     label: "Blog",     icon: "◫" },
  { id: "events",   label: "Events",   icon: "◷" },
];










// ── CART DRAWER ───────────────────────────────
function CartDrawer({ cart, open, onClose }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 90, backdropFilter: "blur(4px)" }} />}
      <div style={{ position: "fixed", top: 0, right: 0, height: "100%", width: "min(360px,100vw)",
        background: "#050c0d", borderLeft: "1px solid #0c1a1c",
        transform: open?"translateX(0)":"translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 100, display: "flex", flexDirection: "column", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", color: "#e8eded", letterSpacing: "0.08em" }}>Cart</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4ecdc4", fontSize: "1rem", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.items.length === 0
            ? <p style={{ fontFamily: "'DM Mono',monospace", color: "#152426", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Your cart is empty.</p>
            : cart.items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: "1px solid #0c1a1c", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.1rem", color: "#e8eded", letterSpacing: "0.06em" }}>{item.name}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.5rem", color: "#253637", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "3px" }}>
                    Qty: {item.qty} · {item.price}
                  </div>
                </div>
                <button onClick={() => cart.remove(item.id)}
                  style={{ background: "none", border: "none", color: "#152426", cursor: "pointer", fontSize: "0.8rem", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color="#4ecdc4"}
                  onMouseLeave={e => e.currentTarget.style.color="#152426"}
                >✕</button>
              </div>
            ))
          }
        </div>
        {cart.items.length > 0 && (
          <div style={{ borderTop: "1px solid #0c1a1c", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", alignItems: "center" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.52rem", letterSpacing: "0.2em", color: "#253637", textTransform: "uppercase" }}>Total</span>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", color: "#e8eded", letterSpacing: "0.05em" }}>${cart.total.toFixed(2)}</span>
            </div>
            <button style={{ width: "100%", background: "#4ecdc4", border: "none", color: "#040a0a",
              fontFamily: "'DM Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase",
              padding: "14px", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="#6edbd3"}
              onMouseLeave={e => e.currentTarget.style.background="#4ecdc4"}
            >Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}

// ── ROOT ──────────────────────────────────────
export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const panelRefs = useRef([]);
  const cart = useCart();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigate = useCallback((nextIdx) => {
    if (nextIdx === activeIdx || animating) return;
    const direction = nextIdx > activeIdx ? 1 : -1;
    setAnimating(true);
    const axis = isMobile ? "X" : "Y";
    const enterFrom = direction > 0 ? "100%" : "-100%";
    const leaveTo   = direction > 0 ? "-100%" : "100%";
    const entering = panelRefs.current[nextIdx];
    const leaving  = panelRefs.current[activeIdx];
    if (!entering || !leaving) return;
    entering.style.transform = `translate${axis}(${enterFrom})`;
    entering.style.opacity = "1";
    entering.style.zIndex = "2";
    leaving.style.zIndex = "1";
    leaving.style.opacity = "1";
    entering.getBoundingClientRect();
    const dur = 640;
    const ease = "cubic-bezier(0.16,1,0.3,1)";
    entering.style.transition = `transform ${dur}ms ${ease}`;
    leaving.style.transition  = `transform ${dur}ms ${ease}`;
    entering.style.transform = `translate${axis}(0%)`;
    leaving.style.transform  = `translate${axis}(${leaveTo})`;
    setTimeout(() => {
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = "";
        el.style.transform = "";
        el.style.opacity = i === nextIdx ? "1" : "0";
        el.style.zIndex = i === nextIdx ? "1" : "0";
      });
      setActiveIdx(nextIdx);
      setAnimating(false);
    }, dur);
  }, [activeIdx, animating, isMobile]);

  const PANELS = [
    <AboutPanel />,
    <ProductsPanel cart={cart} />,
    <BlogPanel />,
    <EventsPanel />
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; overflow: hidden; background: #050b0c; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #070e0f; }
        ::-webkit-scrollbar-thumb { background: #152426; border-radius: 2px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", flexDirection: isMobile?"column":"row",
        background: "#050b0c", color: "#e8eded", overflow: "hidden" }}>

        {/* DESKTOP SIDEBAR */}
        {!isMobile && (
          <nav style={{ width: "68px", flexShrink: 0, borderRight: "1px solid #0a1618",
            display: "flex", flexDirection: "column", alignItems: "center",
            paddingTop: "1.8rem", paddingBottom: "1.8rem", background: "#040a0b", position: "relative", zIndex: 10 }}>
            <div style={{ marginBottom: "3rem", writingMode: "vertical-rl", transform: "rotate(180deg)",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: "0.75rem", letterSpacing: "0.35em",
              color: "#0d1e20", cursor: "default", userSelect: "none" }}>MISTY</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
              {NAV.map((item, i) => (
                <button key={item.id} onClick={() => navigate(i)} title={item.label}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "5px", padding: "14px 0", width: "100%",
                    borderLeft: `2px solid ${activeIdx===i?"#4ecdc4":"transparent"}`,
                    transition: "border-color 0.3s", position: "relative" }}>
                  {activeIdx===i && <div style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)",
                    width: "3px", height: "3px", borderRadius: "50%", background: "#4ecdc4" }} />}
                  <span style={{ fontSize: "0.95rem", color: activeIdx===i?"#4ecdc4":"#152426", transition: "color 0.3s", lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.38rem", letterSpacing: "0.18em",
                    textTransform: "uppercase", color: activeIdx===i?"#4ecdc4":"#101e20", transition: "color 0.3s" }}>{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setCartOpen(true)}
              style={{ background: "none", border: "1px solid #0a1a1c", color: "#152426",
                width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", position: "relative", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#4ecdc4"; e.currentTarget.style.color="#4ecdc4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#0a1a1c"; e.currentTarget.style.color="#152426"; }}>
              <span style={{ fontSize: "0.85rem" }}>⊛</span>
              {cart.items.length > 0 && <span style={{ position: "absolute", top: "2px", right: "2px", width: "7px", height: "7px", borderRadius: "50%", background: "#4ecdc4" }} />}
            </button>
          </nav>
        )}

        {/* PANELS */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "1.2rem", right: "1.2rem", zIndex: 20,
            display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.48rem", letterSpacing: "0.28em", color: "#0d1e20", textTransform: "uppercase" }}>{NAV[activeIdx].label}</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.48rem", letterSpacing: "0.2em", color: "#0a1618" }}>
              {String(activeIdx+1).padStart(2,"0")} / {String(NAV.length).padStart(2,"0")}
            </span>
            {isMobile && (
              <button onClick={() => setCartOpen(true)}
                style={{ background: "none", border: "1px solid #0a1618", color: "#152426", width: "30px", height: "30px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#4ecdc4"; e.currentTarget.style.color="#4ecdc4"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#0a1618"; e.currentTarget.style.color="#152426"; }}>
                <span style={{ fontSize: "0.75rem" }}>⊛</span>
                {cart.items.length > 0 && <span style={{ position: "absolute", top: "2px", right: "2px", width: "5px", height: "5px", borderRadius: "50%", background: "#4ecdc4" }} />}
              </button>
            )}
          </div>

          {PANELS.map((panel, i) => (
            <div key={i} ref={(el) => (panelRefs.current[i] = el)}
              style={{ position: "absolute", inset: 0, opacity: i===0?1:0, zIndex: i===0?1:0, background: "#050b0c", overflow: "hidden" }}>
              {panel}
            </div>
          ))}
        </div>

        {/* MOBILE BOTTOM NAV */}
        {isMobile && (
          <nav style={{ height: "60px", flexShrink: 0, borderTop: "1px solid #0a1618",
            display: "flex", alignItems: "stretch", background: "#040a0b", zIndex: 10 }}>
            {NAV.map((item, i) => (
              <button key={item.id} onClick={() => navigate(i)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
                  borderTop: `2px solid ${activeIdx===i?"#4ecdc4":"transparent"}`,
                  transition: "border-color 0.3s" }}>
                <span style={{ fontSize: "0.9rem", color: activeIdx===i?"#4ecdc4":"#152426", transition: "color 0.3s" }}>{item.icon}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.36rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: activeIdx===i?"#4ecdc4":"#101e20", transition: "color 0.3s" }}>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
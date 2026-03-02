import React, { useState, useEffect, useRef, useCallback } from "react";
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
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className={`fixed inset-0 bg-black/65 z-50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[min(360px,100vw)] bg-[#050c0d] border-l border-[#0c1a1c] z-[60] flex flex-col p-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-['Bebas_Neue',sans-serif] text-3xl text-[#e8eded] tracking-[0.08em]">Cart</h2>
          <button onClick={onClose} className="text-[#4ecdc4] text-lg hover:text-[#6edbd3] transition-colors">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <p className="font-mono text-[#152426] text-[0.62rem] tracking-[0.15em] uppercase">Your cart is empty.</p>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-[#0c1a1c] pb-4 mb-4">
                <div>
                  <div className="font-['Bebas_Neue',sans-serif] text-lg text-[#e8eded] tracking-[0.06em]">{item.name}</div>
                  <div className="font-mono text-[0.5rem] text-[#253637] tracking-[0.12em] uppercase mt-1">
                    Qty: {item.qty} · {item.price}
                  </div>
                </div>
                <button 
                  onClick={() => cart.remove(item.id)}
                  className="text-[#152426] hover:text-[#4ecdc4] text-xs transition-colors"
                >✕</button>
              </div>
            ))
          )}
        </div>
        
        {cart.items.length > 0 && (
          <div className="border-t border-[#0c1a1c] pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[0.52rem] tracking-[0.2em] text-[#253637] uppercase">Total</span>
              <span className="font-['Bebas_Neue',sans-serif] text-3xl text-[#e8eded] tracking-[0.05em]">${cart.total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#4ecdc4] hover:bg-[#6edbd3] text-[#040a0a] font-mono text-[0.6rem] tracking-[0.25em] uppercase py-3.5 transition-colors">
              Checkout
            </button>
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
    
    entering.getBoundingClientRect(); // Force reflow
    
    const dur = 400; // slightly smoothed out animation duration
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
    <AboutPanel key="about" />,
    <ProductsPanel key="products" cart={cart} />,
    <BlogPanel key="blog" />,
    <EventsPanel key="events" />
  ];

  return (
    // Strictly bounds the entire app to 100vw / 100vh. No scrolling allowed on the body.
    <div className="flex h-screen w-screen flex-col md:flex-row bg-[#050b0c] text-[#e8eded] overflow-hidden">
      
      {/* DESKTOP SIDEBAR (hidden on mobile, flex on md+) */}
      <nav className="hidden md:flex w-[100px] shrink-0 border-r border-[#0a1618] flex-col items-center py-7 bg-[#040a0b] relative z-20">
        <div className="mb-12 [writing-mode:vertical-rl] rotate-180 font-['Bebas_Neue',sans-serif] text-xs tracking-[0.35em] text-[#0d1e20] cursor-default select-none">
          MISTY
        </div>
        
        <div className="flex-1 flex flex-col justify-center w-full">
          {NAV.map((item, i) => (
            <button 
              key={item.id} 
              onClick={() => navigate(i)} 
              title={item.label}
              className={`relative flex flex-col items-center justify-center gap-1.5 py-3.5 w-full aspect-square border-l-2 transition-colors duration-300 group ${activeIdx === i ? "border-[#4ecdc4]" : "border-transparent"}`}
            >
              {activeIdx === i && (
                <div className="absolute right-[9px] top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[#4ecdc4]" />
              )}
              <span className="text-3xl text-[#4ecdc4] leading-none">{item.icon}</span>
              <span className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#4ecdc4]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setCartOpen(true)}
          className="w-9 h-9 flex items-center justify-center bg-[#4ecdc4] text-[#152426] border border-[#0a1a1c] hover:border-[#4ecdc4] transition-colors relative group"
        >
          <span className="text-sm">⊛</span>
          {cart.items.length > 0 && (
            <span className="absolute top-0.5 right-0.5 w-[7px] h-[7px] rounded-full bg-[#050b0c] border border-[#4ecdc4]" />
          )}
        </button>
      </nav>

      {/* PANELS WRAPPER */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* TOP RIGHT INDICATOR */}
        <div className="absolute top-5 right-5 z-30 flex items-center gap-3">
          <span className="font-mono text-[0.48rem] tracking-[0.28em] text-[#0d1e20] uppercase hidden md:inline-block">
            {NAV[activeIdx].label}
          </span>
          <span className="font-mono text-[0.48rem] tracking-[0.2em] text-[#0a1618]">
            {String(activeIdx + 1).padStart(2, "0")} / {String(NAV.length).padStart(2, "0")}
          </span>
          
          {/* MOBILE CART ICON */}
          <button 
            onClick={() => setCartOpen(true)}
            className="md:hidden w-[30px] h-[30px] flex items-center justify-center bg-transparent border border-[#0a1618] text-[#152426] hover:border-[#4ecdc4] hover:text-[#4ecdc4] transition-colors relative"
          >
            <span className="text-xs">⊛</span>
            {cart.items.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-[5px] h-[5px] rounded-full bg-[#4ecdc4]" />
            )}
          </button>
        </div>

        {/* PANELS */}
        {PANELS.map((panel, i) => (
          <div 
            key={i} 
            ref={(el) => (panelRefs.current[i] = el)}
            className="absolute inset-0 overflow-hidden bg-[#050b0c]"
            style={{ 
              opacity: i === 0 ? 1 : 0, 
              zIndex: i === 0 ? 1 : 0,
            }}
          >
            {panel}
          </div>
        ))}
      </div>

      {/* MOBILE BOTTOM NAV (flex on mobile, hidden on md+) */}
      <nav className="flex md:hidden h-[60px] shrink-0 border-t border-[#0a1618] items-stretch bg-[#040a0b] relative z-20">
        {NAV.map((item, i) => (
          <button 
            key={item.id} 
            onClick={() => navigate(i)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 border-t-2 transition-colors duration-300 ${activeIdx === i ? "border-[#4ecdc4]" : "border-transparent"}`}
          >
            <span className="text-xl text-[#4ecdc4]">{item.icon}</span>
            <span className="font-mono text-[0.5rem] tracking-[0.15em] uppercase text-[#4ecdc4]">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
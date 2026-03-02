import { useState } from "react";

const EVENTS = [
  { id: 1, date: "MAR 12", city: "MANILA", venue: "BGC Arts Center", title: "MISTY Unveil 2026",
    desc: "First look at the Spectre X Pro and the new Cloud Series. Demo stations, live builds, curated tastings.", status: "OPEN" },
  { id: 2, date: "MAR 28", city: "SINGAPORE", venue: "Capitol Piazza", title: "The Refined Draw Workshop",
    desc: "A curated tasting session pairing premium hardware with our artisanal liquid range. Limited to 40 attendees.", status: "WAITLIST" },
  { id: 3, date: "APR 15", city: "TOKYO", venue: "Omotesando Hills", title: "Fog Garden Installation",
    desc: "An immersive sensory installation exploring vapour as a medium for art. Collaboration with Yuki Tanaka Studio.", status: "COMING SOON" },
];

export default function EventsPanel() {
  const [hovered, setHovered] = useState(null);

  // Status color logic mapping
  const getStatusColor = (s) => {
    if (s === "OPEN") return "#4ecdc4";
    if (s === "WAITLIST") return "#c9a84c";
    return "#426163"; // Coming soon / Muted
  };

  return (
    <div className="h-full w-full flex flex-col p-[clamp(1.5rem,3vw,2.5rem)] px-[clamp(1.5rem,4vw,3.5rem)] bg-[#050b0c]">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-1 shrink-0">
        <div className="w-6 h-px bg-[#4ecdc4]" />
        <span className="font-mono text-[0.55rem] tracking-[0.3em] text-[#4ecdc4] uppercase">Upcoming</span>
      </div>
      
      <h2 className="font-['Bebas_Neue',sans-serif] text-[clamp(2rem,4vw,3rem)] text-[#e8eded] tracking-[0.04em] mb-[clamp(1rem,2.5vw,1.8rem)] leading-none shrink-0">
        Where We Are
      </h2>

      {/* Events List */}
      <div className="flex-1 flex flex-col gap-px bg-[#0a1415] min-h-0">
        {EVENTS.map((ev) => {
          const sCol = getStatusColor(ev.status);
          
          return (
            <div 
              key={ev.id} 
              onMouseEnter={() => setHovered(ev.id)} 
              onMouseLeave={() => setHovered(null)}
              className={`flex-1 relative grid grid-cols-[clamp(70px,8vw,100px)_1fr_auto] items-center gap-[clamp(1rem,2.5vw,2rem)] px-[clamp(1rem,2.5vw,2rem)] py-[clamp(1rem,2vw,1.4rem)] transition-colors duration-300 overflow-hidden ${
                hovered === ev.id ? "bg-[#0c1819]" : "bg-[#070e0f]"
              }`}
            >
              {/* Animated Accent Border */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-[2px] origin-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ 
                  backgroundColor: sCol,
                  transform: hovered === ev.id ? "scale-y(1)" : "scale-y(0)" 
                }} 
              />

              {/* Date & City */}
              <div>
                <div className="font-['Bebas_Neue',sans-serif] text-[clamp(1.6rem,2.5vw,2.2rem)] text-[#e8eded] leading-none">
                  {ev.date}
                </div>
                <div className="font-mono text-[0.46rem] tracking-[0.18em] text-[#699390] uppercase mt-1">
                  {ev.city}
                </div>
              </div>

              {/* Main Info */}
              <div className="min-w-0">
                <div className="font-mono text-[0.46rem] tracking-[0.15em] text-[#426163] uppercase mb-1.5">
                  {ev.venue}
                </div>
                <h3 className={`font-['Bebas_Neue',sans-serif] text-[clamp(1rem,1.6vw,1.4rem)] tracking-[0.05em] mb-1.5 transition-colors duration-300 ${
                  hovered === ev.id ? "text-[#e8eded]" : "text-[#93b2b0]"
                }`}>
                  {ev.title}
                </h3>
                <p className="font-['DM_Sans',sans-serif] text-[clamp(0.65rem,0.82vw,0.8rem)] text-[#5c7a7d] leading-normal font-light line-clamp-2">
                  {ev.desc}
                </p>
              </div>

              {/* Status & CTA */}
              <div className="flex flex-col items-end shrink-0">
                <div 
                  className="font-mono text-[0.46rem] tracking-[0.18em] uppercase border px-2.5 py-1 mb-3 whitespace-nowrap"
                  style={{ color: sCol, borderColor: `${sCol}40` }}
                >
                  {ev.status}
                </div>
                
                {ev.status !== "COMING SOON" && (
                  <button className="bg-transparent border border-[#1e3032] text-[#5c7a7d] font-mono text-[0.46rem] tracking-[0.18em] uppercase px-3 py-1.5 hover:border-[#4ecdc4] hover:text-[#4ecdc4] transition-all duration-200 whitespace-nowrap">
                    RSVP →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
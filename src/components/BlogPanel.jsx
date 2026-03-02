import { useState } from "react";

const BLOGS = [
  { id: 1, no: "01", date: "FEB 18 2026", title: "The Architecture of Draw Resistance",
    excerpt: "Airflow geometry is the invisible hand shaping your experience. We break down what engineers rarely explain to the end consumer.", read: "6 min" },
  { id: 2, no: "02", date: "FEB 03 2026", title: "Artisanal Flavour: Beyond the Label",
    excerpt: "Single-origin botanicals and food-grade isolates — why the sourcing of your liquid matters more than the bottle design.", read: "4 min" },
  { id: 3, no: "03", date: "JAN 20 2026", title: "Cloud Density as Craft",
    excerpt: "High-VG formulas and wattage curves. A primer on chasing the perfect dense, slow-rolling exhale that defines the art of the cloud.", read: "5 min" },
];

export default function BlogPanel() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="h-full w-full flex flex-col p-[clamp(1.5rem,3vw,2.5rem)] px-[clamp(1.5rem,4vw,3.5rem)] bg-[#050b0c]">
      
      {/* Header Section */}
      <div className="flex items-center gap-2.5 mb-1 shrink-0">
        <div className="w-6 h-px bg-[#4ecdc4]" />
        <span className="font-mono text-[0.55rem] tracking-[0.3em] text-[#4ecdc4] uppercase">
          Journal
        </span>
      </div>
      
      <h2 className="font-['Bebas_Neue',sans-serif] text-[clamp(2rem,4vw,3rem)] text-[#e8eded] tracking-[0.04em] mb-[clamp(1rem,2.5vw,1.8rem)] leading-none shrink-0">
        The Edit
      </h2>

      {/* Blogs Container - flex-1 ensures it fills remaining vertical space */}
      <div className="flex-1 flex flex-col gap-px bg-[#0a1415] min-h-0">
        {BLOGS.map((b) => (
          <div 
            key={b.id} 
            onMouseEnter={() => setHovered(b.id)} 
            onMouseLeave={() => setHovered(null)}
            className={`flex-1 relative flex items-center gap-[clamp(1rem,3vw,2.5rem)] px-[clamp(1rem,2.5vw,2rem)] py-[clamp(1rem,2vw,1.4rem)] cursor-pointer transition-colors duration-300 overflow-hidden ${
              hovered === b.id ? "bg-[#0c1819]" : "bg-[#070e0f]"
            }`}
          >
            {/* Animated Hover Borders */}
            <div 
              className={`absolute bottom-0 left-0 right-0 h-px bg-[#4ecdc4] origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                hovered === b.id ? "scale-x-100" : "scale-x-0"
              }`} 
            />
            <div 
              className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#4ecdc4] origin-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                hovered === b.id ? "scale-y-100" : "scale-y-0"
              }`} 
            />

            {/* Big Index Number */}
            <span className="font-['Bebas_Neue',sans-serif] text-[clamp(2.5rem,5vw,4rem)] text-[#122426] tracking-[0.05em] shrink-0 leading-none transition-colors duration-300">
              {b.no}
            </span>

            {/* Content Body */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-4 items-center mb-1.5">
                <span className="font-mono text-[0.55rem] tracking-[0.2em] text-[#699390] uppercase">
                  {b.date}
                </span>
                <span className="font-mono text-[0.55rem] tracking-[0.15em] text-[#426163] uppercase">
                  {b.read} read
                </span>
              </div>
              
              <h3 className={`font-['Bebas_Neue',sans-serif] text-[clamp(1.1rem,1.8vw,1.6rem)] tracking-[0.05em] mb-1.5 transition-colors duration-300 ${
                hovered === b.id ? "text-[#e8eded]" : "text-[#93b2b0]"
              }`}>
                {b.title}
              </h3>
              
              <p className="font-['DM_Sans',sans-serif] text-[clamp(0.7rem,0.85vw,0.85rem)] text-[#5c7a7d] leading-[1.65] font-light line-clamp-2 md:line-clamp-none">
                {b.excerpt}
              </p>
            </div>

            {/* Call to Action Arrow */}
            <div 
              className={`shrink-0 transition-all duration-300 ${
                hovered === b.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
            >
              <span className="font-mono text-[0.6rem] text-[#4ecdc4] tracking-[0.2em] uppercase whitespace-nowrap">
                Read →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
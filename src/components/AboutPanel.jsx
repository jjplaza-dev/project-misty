import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AboutPanel() {
  const statRefs = useRef([]);

  // Data structure to handle GSAP logic easily
  const stats = [
    { endValue: 120, suffix: "+", label: "Curated Devices", isFloat: false },
    { endValue: 40, suffix: "+", label: "Artisanal Liquids", isFloat: false },
    { endValue: 4.9, suffix: "★", label: "Avg. Rating", isFloat: true },
  ];

  useEffect(() => {
    // GSAP Counter Animation
    stats.forEach((stat, index) => {
      const targetElement = statRefs.current[index];
      if (!targetElement) return;

      const counter = { value: stat.isFloat ? 0.1 : 0 };

      gsap.to(counter, {
        value: stat.endValue,
        duration: 2,
        ease: "power3.out",
        delay: 0.2, // Slight delay so the user sees the animation start when opening
        onUpdate: () => {
          const currentVal = stat.isFloat
            ? counter.value.toFixed(1)
            : Math.floor(counter.value);
          targetElement.textContent = `${currentVal}${stat.suffix}`;
        },
      });
    });
  }, []);

  return (
    // Fixed viewport constraints: w-screen, h-screen, overflow-hidden
    // Added a dark background (#091110) to support the light text colors
    // Change w-screen h-screen -> w-full h-full
    <div className="relative w-full h-full flex items-center overflow-hidden bg-[#091110]">
      
      {/* Right-side radial gradient */}
      <div className="absolute w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full -right-[15vw] top-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(78,205,196,0.05)_0%,transparent_68%)] pointer-events-none" />
      
      {/* Left-side vertical gradient line */}
      <div className="absolute left-[clamp(2.5rem,5vw,5rem)] top-0 bottom-0 w-[1px] bg-[linear-gradient(to_bottom,transparent,#1a3533_25%,#1a3533_75%,transparent)]" />
      
      {/* Main Content Container */}
      <div className="relative z-10 pl-[clamp(3.5rem,8vw,8rem)] pr-8 max-w-[720px]">
        
        {/* Eyebrow / Subtitle */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-7 h-px bg-[#4ecdc4]" />
          <span className="font-mono text-[0.58rem] tracking-[0.35em] text-[#4ecdc4] uppercase">
            Digital Vape Destination
          </span>
        </div>
        
        {/* Headline */}
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(4rem,9.5vw,8.5rem)] leading-[0.9] tracking-[0.03em] text-[#e8eded] mb-10">
          FIND<br />
          <span className="text-[#4ecdc4]">YOUR</span><br />
          DRAW.
        </h1>
        
        {/* Paragraph */}
        <p className="font-['DM_Sans',sans-serif] text-[clamp(0.82rem,1.1vw,0.95rem)] leading-[1.9] text-[#93b2b0] max-w-[430px] mb-12 font-light">
          MISTY bridges high-performance hardware with a refined sensory experience.
          Precision-engineered devices, artisanal e-liquids — all defined by clarity,
          quality, and the art of the cloud.
        </p>
        
        {/* Animated Stats Block */}
        <div className="flex gap-[clamp(1.5rem,4vw,3.5rem)] flex-wrap">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <div
                ref={(el) => (statRefs.current[index] = el)}
                className="font-['Bebas_Neue',sans-serif] text-[clamp(1.8rem,3vw,2.6rem)] text-[#e8eded] leading-none"
              >
                {/* Fallback starting text before JS kicks in */}
                {stat.isFloat ? "0.1" : "0"}{stat.suffix} 
              </div>
              <div className="font-mono text-[0.5rem] tracking-[0.2em] text-[#699390] uppercase mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Right Watermark */}
      <div className="absolute -right-4 -bottom-16 font-['Bebas_Neue',sans-serif] text-[clamp(7rem,16vw,15rem)] text-[rgba(78,205,196,0.03)] leading-none pointer-events-none select-none tracking-[0.06em]">
        CLOUD
      </div>
    </div>
  );
}
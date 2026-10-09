"use client";

import { useEffect, useState } from "react";

export default function CoffeeShopIntro({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [textStep, setTextStep] = useState(0);

  useEffect(() => {
    // Sequence the text animations
    const t1 = setTimeout(() => setTextStep(1), 500);
    const t2 = setTimeout(() => setTextStep(2), 2000);
    const t3 = setTimeout(() => setTextStep(3), 3500);
    
    // Complete the intro after 7 seconds
    const t4 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 1000);
    }, 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const skipIntro = () => {
    setFadeOut(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0d0602] transition-opacity duration-1000 overflow-hidden ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Cinematic slowly zooming background image of a barista */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 animate-[zoomPan_10s_ease-in-out_forwards]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=2000&q=80')",
          transformOrigin: "center center"
        }}
      />
      
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090401] via-[#090401]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#090401]/80 via-transparent to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        
        {/* Step 1: Welcome (ಸ್ವಾಗತ) */}
        <p 
          className={`font-caveat text-3xl md:text-5xl text-[#D4AF37] tracking-widest uppercase mb-4 transition-all duration-1000 ${
            textStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ textShadow: "0 4px 20px rgba(212,175,55,0.4)" }}
        >
          ಸ್ವಾಗತ
        </p>

        {/* Step 2: Namma Brew */}
        <h1 
          className={`font-playfair text-6xl md:text-8xl lg:text-9xl font-black text-[#FDFBF7] leading-none mb-8 transition-all duration-1000 delay-300 ${
            textStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}
        >
          Namma<br/>
          <span className="text-[#D4AF37] italic">Brew</span>
        </h1>

        {/* Step 3: Hygiene & Vibe (ಸ್ವಚ್ಛ · ಕ್ರಮಬದ್ಧ · ಉನ್ನತ ಗುಣಮಟ್ಟ) */}
        <div 
          className={`transition-all duration-1000 delay-500 ${
            textStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-caveat text-2xl md:text-4xl text-[#FDFBF7]/90 mb-6 drop-shadow-lg">
            ನಮ್ಮ ಕಾಫಿ — ನಮ್ಮ ವೈಬ್ — ನಮ್ಮ ಬೆಂಗಳೂರು
          </p>
          
          <div className="inline-flex items-center gap-3 bg-[#2E4F4F]/40 backdrop-blur-md border border-[#D4AF37]/30 rounded-full px-6 py-2 shadow-2xl">
            <span className="text-[#D4AF37]">✦</span>
            <span className="text-[#FDFBF7] text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
              ಸ್ವಚ್ಛ · ಕ್ರಮಬದ್ಧ · ಉನ್ನತ ಗುಣಮಟ್ಟ
            </span>
            <span className="text-[#D4AF37]">✦</span>
          </div>
        </div>

      </div>

      {/* Skip Button */}
      <button type="button"
        onClick={skipIntro}
        className="absolute top-6 right-6 px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/70 text-xs font-semibold tracking-widest uppercase transition-all duration-300 z-10"
      >
        Skip ›
      </button>

      {/* Keyframes for the cinematic zoom and pan */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes zoomPan {
          0% { transform: scale(1.05) translateY(0); }
          100% { transform: scale(1.15) translateY(-2%); }
        }
      `}} />
    </div>
  );
}

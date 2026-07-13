"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";

export default function Loader() {
  const [statusIdx, setStatusIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const statuses = [
    "Reading uploaded file...",
    "Scanning image layout...",
    "Sending visual token to Gemini VLM...",
    "Transcribing handwritten notes...",
    "Resolving ambiguous words...",
    "Structuring requirements list...",
  ];

  // Rotate status message every 1.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out, change text, fade in
      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.25,
          onComplete: () => {
            setStatusIdx((prev) => (prev + 1) % statuses.length);
            gsap.fromTo(
              textRef.current,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.3 }
            );
          },
        });
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // GSAP continuous spin for the loading circle and subtle scale pulsing
  useEffect(() => {
    // Spin ring
    gsap.to(ringRef.current, {
      rotate: 360,
      duration: 1.5,
      repeat: -1,
      ease: "none",
    });

    // Fade in container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl max-w-xl mx-auto w-full min-h-[300px] text-center shadow-xl opacity-0"
    >
      <div className="relative mb-8">
        {/* Outer glowing pulsing background */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />

        {/* Spin Ring */}
        <div
          ref={ringRef}
          className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500 border-r-indigo-400 shadow-lg shadow-indigo-500/20"
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        Transcribing Image...
      </h3>
      
      <p
        ref={textRef}
        className="text-sm text-slate-400 font-medium tracking-wide min-h-[20px]"
      >
        {statuses[statusIdx]}
      </p>

      {/* Progress placeholder bar */}
      <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-violet-500 w-1/3 rounded-full animate-progress" />
      </div>
    </div>
  );
}

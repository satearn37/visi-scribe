"use client";

import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, RefreshCw, Edit3, Image as ImageIcon, FileText } from "lucide-react";
import gsap from "gsap";

interface ResultPanelProps {
  text: string;
  previewUrl: string | null;
  fileName: string | null;
  onReset: () => void;
  onTextChange: (newText: string) => void;
}

export default function ResultPanel({
  text,
  previewUrl,
  fileName,
  onReset,
  onTextChange,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  // GSAP animation on enter
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // GSAP button pop animation
      gsap.fromTo(
        copyBtnRef.current,
        { scale: 1 },
        { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch opacity-0"
    >
      {/* Left Column: Image Preview */}
      <div className="lg:col-span-5 flex flex-col bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 md:p-5 h-full min-h-[350px] lg:min-h-[500px]">
        <div className="flex items-center gap-2 mb-3 px-1">
          <ImageIcon className="w-4.5 h-4.5 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Source Image Reference
          </span>
        </div>

        {/* Image Container with absolute positioning and fit */}
        <div className="flex-1 relative bg-slate-950/50 rounded-xl overflow-hidden border border-slate-950 flex items-center justify-center p-2 group">
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Source preview"
                className="max-h-[300px] lg:max-h-[420px] max-w-full object-contain rounded transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute bottom-2 left-2 px-3 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] text-slate-400 font-mono border border-slate-800/30 truncate max-w-[90%]">
                {fileName || "uploaded_image.png"}
              </div>
            </>
          ) : (
            <div className="text-center p-6 space-y-2">
              <ImageIcon className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500">Preview not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Editable Text Area */}
      <div className="lg:col-span-7 flex flex-col bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 md:p-5 h-full min-h-[450px] lg:min-h-[500px]">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Transcribed Requirements
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              ref={copyBtnRef}
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                copied
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Text
                </>
              )}
            </button>

            {/* Reset / Upload New Button */}
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-400/20 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Upload New
            </button>
          </div>
        </div>

        {/* Editable Text Editor Container */}
        <div className="flex-1 flex flex-col relative">
          <div className="absolute top-2.5 right-3.5 flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded pointer-events-none">
            <Edit3 className="w-3 h-3" />
            <span>Interactive Editor</span>
          </div>

          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="No transcription text found..."
            className="flex-1 w-full bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-4 pt-8 pr-12 text-sm text-slate-200 leading-relaxed font-mono resize-none focus:outline-none transition-all duration-200 min-h-[300px]"
          />
        </div>

        {/* VLM Verification Note */}
        <div className="mt-4 pt-3 border-t border-slate-800/40 text-xs text-slate-500 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span>
            * Text is fully editable. Adjust any corrections before copy.
          </span>
          <span className="text-amber-500/80 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Check [uncertain: ...] markers for ambiguous handwriting.
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, FileText, AlertCircle, ArrowRight, Eye, ShieldCheck } from "lucide-react";
import gsap from "gsap";

import { useExtractText } from "@/hooks/useExtractText";
import Dropzone from "@/components/ui/Dropzone";
import ResultPanel from "@/components/ui/ResultPanel";
import Loader from "@/components/ui/Loader";
import ApiKeySettings from "@/components/ui/ApiKeySettings";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [hasServerKey, setHasServerKey] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const {
    file,
    previewUrl,
    text,
    isLoading,
    error,
    extractText,
    reset,
    setText,
  } = useExtractText();

  // Load API keys on mount
  useEffect(() => {
    setIsMounted(true);
    
    // Get local key
    const localKey = localStorage.getItem("gemini_api_key") || "";
    setApiKey(localKey);

    // Check server key status
    const checkServerKey = async () => {
      try {
        const response = await fetch("/api/check-key");
        const data = await response.json();
        setHasServerKey(!!data.hasKey);
      } catch (err) {
        console.error("Failed to check server key state:", err);
      }
    };
    checkServerKey();
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (isMounted) {
      const tl = gsap.timeline();
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          mainRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2"
        );
    }
  }, [isMounted]);

  const handleFileSelect = (selectedFile: File) => {
    extractText(selectedFile, apiKey);
  };

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem("gemini_api_key", newKey);
  };

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative min-h-screen pb-12 overflow-hidden bg-slate-950">
      {/* Glow Effects */}
      <div className="glow-spot top-[-100px] left-[-100px]" />
      <div className="glow-spot bottom-[-200px] right-[-100px]" />

      {/* Navigation Header */}
      <header
        ref={headerRef}
        className="relative z-10 w-full border-b border-slate-900 bg-slate-950/60 backdrop-blur-md opacity-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                VisiScribe
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-semibold text-indigo-400/90 ml-2 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">
                Gemini 2.5 VLM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ApiKeySettings
              apiKey={apiKey}
              setApiKey={handleApiKeyChange}
              hasServerKey={hasServerKey}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        ref={mainRef}
        className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10 flex flex-col justify-center items-center w-full opacity-0"
      >
        {/* Render different UI states depending on execution */}
        {isLoading ? (
          <div className="w-full py-12">
            <Loader />
          </div>
        ) : text ? (
          <div className="w-full">
            <ResultPanel
              text={text}
              previewUrl={previewUrl}
              fileName={file ? file.name : null}
              onReset={reset}
              onTextChange={setText}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Title / Intro Hero */}
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-medium tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                No password lock. Fully serverless integration.
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Turn mockups and sketches into{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
                  requirements lists
                </span>
              </h1>
              <p className="text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
                Upload your team screenshots, wireframes, whiteboard summaries, or messy handwritten client notes. Get a structured markdown list instantly.
              </p>
            </div>

            {/* Warning block if API Key is fully missing */}
            {!apiKey && !hasServerKey && (
              <div className="w-full max-w-2xl mb-6 px-4 py-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex gap-3 leading-relaxed items-start animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Gemini API Key Required</strong>
                  No default API key is set on the server. Please click the <strong className="text-amber-300 font-medium">"API Key" Settings button</strong> in the top right to configure your Google AI Studio key. It is saved locally in your browser.
                </div>
              </div>
            )}

            {/* Error block if extraction crashed */}
            {error && (
              <div className="w-full max-w-2xl mb-6 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3 leading-relaxed items-start animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Transcription Failed</strong>
                  {error}
                </div>
              </div>
            )}

            {/* File upload Zone */}
            <Dropzone onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="w-full border-t border-slate-900/60 pt-6 mt-12 text-center text-xs text-slate-500 relative z-10 opacity-0"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} VisiScribe.</p>
          <div className="flex gap-4">
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Google AI Studio
            </a>
            <span>•</span>
            <a
              href="https://github.com/google-gemini"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Gemini API Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Key, Eye, EyeOff, Check, X, ShieldAlert, ExternalLink, Settings } from "lucide-react";
import gsap from "gsap";

interface ApiKeySettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasServerKey: boolean;
}

export default function ApiKeySettings({
  apiKey,
  setApiKey,
  hasServerKey,
}: ApiKeySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey]);

  // GSAP animation for opening/closing drawer
  useEffect(() => {
    if (isOpen) {
      // Open animation
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      // Close animation
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    setApiKey(tempKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsOpen(false);
    }, 800);
  };

  const handleClear = () => {
    setTempKey("");
    setApiKey("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 800);
  };

  const getStatus = () => {
    if (apiKey) {
      return {
        text: "Custom Local Key Active",
        color: "bg-emerald-500",
        bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      };
    }
    if (hasServerKey) {
      return {
        text: "Default Server Key Active",
        color: "bg-blue-500",
        bg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      };
    }
    return {
      text: "API Key Required",
      color: "bg-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    };
  };

  const status = getStatus();

  const drawerContent = (
    <>
      {/* Drawer Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity"
      />

      {/* Settings Drawer (Right Side) */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 md:p-8 flex flex-col transform translate-x-full"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-white">API Settings</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Key Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Gemini VLM API Key</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This application uses Google's Gemini Vision Language Model to transcribe images. 
              To avoid quotas limits, you can provide your own API key.
            </p>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Get a free API Key from Google AI Studio
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Status Badge inside panel */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Configuration</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
              <span className="text-sm font-medium text-white">{status.text}</span>
            </div>
            {hasServerKey && !apiKey && (
              <p className="text-xs text-slate-400 mt-1">
                The server has a configured API key. You don't need to add a local key unless you want to override it.
              </p>
            )}
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder={hasServerKey ? "Using server key (Enter key to override)" : "AIzaSy..."}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-600 outline-none transition-all"
              />
              <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3 p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 text-xs text-indigo-300/90 leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              <strong>Privacy First:</strong> Your API key is stored safely in your browser's <code>localStorage</code>.
              It is sent directly inside headers to our API route for requests, and is never logged or stored permanently on our servers.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-800 pt-5 flex gap-3">
          {apiKey && (
            <button
              onClick={handleClear}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/30 text-red-400 font-medium text-sm transition-all cursor-pointer"
            >
              Clear Key
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Settings trigger button & status indicator */}
      <div className="flex items-center gap-3">
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${status.bg}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.color} animate-pulse`} />
          {status.text}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white transition-all duration-200 shadow-lg backdrop-blur-md cursor-pointer flex items-center gap-2 font-medium text-sm group"
          aria-label="API Settings"
        >
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          <span className="hidden md:inline">API Key</span>
        </button>
      </div>

      {mounted && typeof document !== "undefined"
        ? createPortal(drawerContent, document.body)
        : null}
    </>
  );
}

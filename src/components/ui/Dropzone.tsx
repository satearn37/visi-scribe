"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Clipboard, FileWarning } from "lucide-react";
import gsap from "gsap";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function Dropzone({ onFileSelect, isLoading }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard Paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndSelect(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isLoading]);

  // GSAP animations for drag and hover states
  const handleMouseEnter = () => {
    if (isLoading) return;
    gsap.to(dropzoneRef.current, {
      scale: 1.01,
      borderColor: "#6366f1", // indigo-500
      backgroundColor: "rgba(30, 41, 59, 0.6)", // slate-800/60
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.15)",
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    if (isLoading || isDragActive) return;
    gsap.to(dropzoneRef.current, {
      scale: 1,
      borderColor: "rgba(51, 65, 85, 0.5)", // slate-700/50
      backgroundColor: "rgba(15, 23, 42, 0.4)", // slate-900/40
      boxShadow: "none",
      duration: 0.3,
    });
  };

  useEffect(() => {
    if (isDragActive) {
      gsap.to(dropzoneRef.current, {
        scale: 1.03,
        borderColor: "#818cf8", // indigo-400
        backgroundColor: "rgba(99, 102, 241, 0.08)", // indigo-500/8
        boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.25)",
        duration: 0.2,
      });
    } else {
      gsap.to(dropzoneRef.current, {
        scale: 1,
        borderColor: "rgba(51, 65, 85, 0.5)",
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        boxShadow: "none",
        duration: 0.2,
      });
    }
  }, [isDragActive]);

  const validateAndSelect = (file: File) => {
    setErrorMsg(null);

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Unsupported format. Please upload JPG, PNG, or WebP.");
      triggerErrorAnimation();
      return;
    }

    // Validate size (10MB limit)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg("File too large. Maximum size is 10MB.");
      triggerErrorAnimation();
      return;
    }

    onFileSelect(file);
  };

  const triggerErrorAnimation = () => {
    gsap.fromTo(
      dropzoneRef.current,
      { x: -10 },
      { x: 0, duration: 0.4, ease: "rough({ template: none, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false })" }
    );
    gsap.to(dropzoneRef.current, {
      borderColor: "#f87171", // red-400
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 bg-slate-900/40 backdrop-blur-md rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] md:min-h-[360px] group ${
          isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* Dynamic Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Upload Icon */}
        <div className="relative p-5 rounded-2xl bg-slate-800/40 border border-slate-800/50 text-indigo-400 group-hover:text-indigo-300 transition-colors mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
          <UploadCloud className="w-10 h-10" />
        </div>

        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          Drag & drop your client sketch or screenshot
        </h3>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Or click to browse files from your computer. Supports <span className="text-slate-300 font-medium">JPEG, PNG, WebP</span> up to 10MB.
        </p>

        {/* Clipboard integration note */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-800/40 text-slate-400 text-xs font-medium">
          <Clipboard className="w-3.5 h-3.5" />
          <span>Protip: You can paste an image directly (Ctrl+V)</span>
        </div>
      </div>

      {/* Client-side Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-2xl mx-auto animate-fadeIn">
          <FileWarning className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

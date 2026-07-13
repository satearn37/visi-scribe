"use client";

import { useState, useCallback } from "react";
import { ExtractionState, ExtractionResponse } from "@/types/ocr";

export function useExtractText() {
  const [state, setState] = useState<ExtractionState>({
    file: null,
    previewUrl: null,
    text: "",
    isLoading: false,
    error: null,
  });

  const reset = useCallback(() => {
    // Revoke the object URL to avoid memory leaks
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    setState({
      file: null,
      previewUrl: null,
      text: "",
      isLoading: false,
      error: null,
    });
  }, [state.previewUrl]);

  const updateText = useCallback((newText: string) => {
    setState((prev) => ({ ...prev, text: newText }));
  }, []);

  const extractText = useCallback(async (file: File, clientApiKey: string) => {
    // Create preview url
    const previewUrl = URL.createObjectURL(file);

    setState({
      file,
      previewUrl,
      text: "",
      isLoading: true,
      error: null,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Create headers, conditionally adding x-api-key if client provided a local key
      const headers: Record<string, string> = {};
      if (clientApiKey && clientApiKey.trim() !== "") {
        headers["x-api-key"] = clientApiKey.trim();
      }

      const response = await fetch("/api/extract-text", {
        method: "POST",
        headers,
        body: formData,
      });

      const data: ExtractionResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract text from image.");
      }

      setState((prev) => ({
        ...prev,
        text: data.text || "",
        isLoading: false,
        error: null,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "An unexpected error occurred.",
      }));
    }
  }, []);

  return {
    ...state,
    extractText,
    reset,
    setText: updateText,
  };
}

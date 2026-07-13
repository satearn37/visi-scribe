import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { VLM_INSTRUCTION } from "@/lib/instruction";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. Retrieve the Gemini API Key from headers (client-side) or environment variables (server-side)
    const apiKey = req.headers.get("x-api-key") || process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        { 
          error: "Missing API Key. Please provide a Gemini API Key in the settings panel (top right) or configure it in the server environment variables." 
        },
        { status: 400 }
      );
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    // 3. Validate File Type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are supported." },
        { status: 400 }
      );
    }

    // 4. Validate File Size (Cap at 10MB)
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File too large. Maximum supported image size is 10MB." },
        { status: 400 }
      );
    }

    // 5. Read file as ArrayBuffer and convert to Base64
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const base64Data = fileBuffer.toString("base64");

    // 6. Initialize Google Gen AI client with the resolved API key
    const ai = new GoogleGenAI({ apiKey });

    // 7. Perform the VLM call
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: VLM_INSTRUCTION },
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    const transcribedText = response.text;
    if (!transcribedText) {
      return NextResponse.json(
        { error: "Transcriber failed to extract text from this image." },
        { status: 500 }
      );
    }

    // Return the transcribed text
    return NextResponse.json({ text: transcribedText });

  } catch (error: any) {
    console.error("API extract-text error:", error);
    
    // Check for common API Key or quota errors
    const errorMessage = error.message || "";
    let userFriendlyMessage = "An error occurred while communicating with the Gemini model.";
    
    if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
      userFriendlyMessage = "The provided Gemini API key is invalid. Please check your credentials in the settings panel.";
    } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      userFriendlyMessage = "Gemini API quota exceeded. Please try again later or verify your API billing settings.";
    } else {
      userFriendlyMessage = `Error: ${errorMessage}`;
    }

    return NextResponse.json(
      { error: userFriendlyMessage },
      { status: 500 }
    );
  }
}

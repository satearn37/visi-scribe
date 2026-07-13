import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisiScribe — Image to Structured Requirements",
  description: "Extract typed and handwritten requirements from screenshots, mockups, or whiteboard sketches using Gemini VLM. Get clean, formatted, and editable requirements lists instantly.",
  keywords: "VLM, OCR, Handwriting transcription, next.js, gemini, image to text, software requirements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

# VisiScribe

VisiScribe is a modern, privacy-first web application designed to turn mockups, wireframes, whiteboard sketches, and handwritten notes into structured, professional Markdown requirements lists using Google's **Gemini Vision Language Models (VLM)**.

<img width="871" height="353" alt="Screenshot 2026-07-13 221124" src="https://github.com/user-attachments/assets/ed321c92-8eba-4285-a919-402c6aae9e1d" />
*

## Key Features

-  **Image-to-Requirements Conversion:** Upload sketches, diagrams, mockups, or screenshots to instantly extract structured specifications.
-  **Interactive Markdown Editor:** Live editor allows you to refine, edit, and organize requirements directly inside the app before copying them.
-  **Privacy-First (Local Keys):** Users can enter their own Gemini API Key. It is stored securely in `localStorage` in the browser, sent directly through headers, and never saved or logged on the server.
-  **Paste from Clipboard:** Pro-tip features allow you to press `Ctrl+V` to paste screenshots directly from your clipboard into the dropzone.
-  **Sleek, Modern UI:** High-performance micro-animations powered by **GSAP** paired with a dark glassmorphism design system.
- ☁️ **Server-Wide Fallback Support:** Administrators can configure a fallback server-side API key so general visitors can use the tool out-of-the-box.

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [GSAP (GreenSock)](https://gsap.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI SDK:** [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gen AI SDK)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18.0.0 or higher is recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/visi-scribe.git
   cd visi-scribe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── check-key/     # Checks server key availability status
│   │   │   └── extract-text/  # Calls Gemini VLM using Node.js runtime
│   │   ├── layout.tsx         # Root layout with fonts and metadata
│   │   ├── page.tsx           # Home dashboard interface
│   │   └── globals.css        # Tailwind styles and gradients
│   ├── components/
│   │   └── ui/
│   │       ├── ApiKeySettings.tsx  # Portal-rendered settings drawer
│   │       ├── Dropzone.tsx        # Drag & drop and paste image zone
│   │       ├── ResultPanel.tsx     # Copyable markdown text editor
│   │       └── Loader.tsx          # Animated wait screen
│   ├── hooks/
│   │   └── useExtractText.ts  # OCR extraction and error handling logic
│   └── types/
│       └── ocr.ts             # TypeScript type declarations
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

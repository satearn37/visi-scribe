# VisiScribe

VisiScribe is a modern, privacy-first web application designed to turn mockups, wireframes, whiteboard sketches, and handwritten notes into structured, professional Markdown requirements lists using Google's **Gemini Vision Language Models (VLM)**.

![VisiScribe Screenshot](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80) *(Replace with actual application screenshot)*

## Key Features

- 📸 **Image-to-Requirements Conversion:** Upload sketches, diagrams, mockups, or screenshots to instantly extract structured specifications.
- ⚡ **Interactive Markdown Editor:** Live editor allows you to refine, edit, and organize requirements directly inside the app before copying them.
- 🔒 **Privacy-First (Local Keys):** Users can enter their own Gemini API Key. It is stored securely in `localStorage` in the browser, sent directly through headers, and never saved or logged on the server.
- 📋 **Paste from Clipboard:** Pro-tip features allow you to press `Ctrl+V` to paste screenshots directly from your clipboard into the dropzone.
- 🌀 **Sleek, Modern UI:** High-performance micro-animations powered by **GSAP** paired with a dark glassmorphism design system.
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

## Configuration & Environment Variables

If you want to host the app and let visitors use it without entering their own keys, you can set a server-wide API key.

1. Copy the `.env.local.example` template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your key:
   ```env
   GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
   ```

*(If this variable is left empty, the application will automatically prompt the user to input their own free API key through the settings drawer in the top right corner).*

---

## Deployment to Vercel

VisiScribe is optimized for zero-config deployment on Vercel:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com/) and import the project.
3. (Optional) To configure a server-wide key, add `GEMINI_API_KEY` to the **Environment Variables** tab.
4. Click **Deploy**.

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

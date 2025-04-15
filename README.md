# Git Canvas Chrome Extension

A visual project planner and architecture documentation tool for GitHub projects. Built as a Chrome Extension using React, TypeScript, Vite, and react-flow.

## Features
- Visual canvas for planning (standalone or linked to GitHub projects)
- GitHub OAuth integration
- Persistent storage with chrome.storage
- AI-powered planning assistance

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build the extension for Chrome:
   ```bash
   npm run build
   ```
4. Load the `dist` folder as an unpacked extension in Chrome.

## Development
- Popup and main canvas are React components.
- Manifest V3 is used for Chrome Extension compatibility.
- See `.github/copilot-instructions.md` for Copilot customization.

## Setup
- Add your AI API key in the options page for AI features.
- Authenticate with GitHub via the popup when prompted.

---
MIT License

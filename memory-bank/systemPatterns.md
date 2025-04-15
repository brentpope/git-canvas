# System Patterns

## Architecture Overview
Git Canvas is structured as a Chrome Extension using Manifest V3. The extension consists of a popup UI, an options page, a visual canvas, and a background service worker. The UI is built with React and TypeScript, and the visual planning canvas uses React Flow. Persistent data is stored using chrome.storage. GitHub OAuth is handled via the background script and Chrome identity APIs.

## Key Technical Decisions
- Use of React and React Flow for a modern, interactive UI and visual canvas
- Chrome Extension Manifest V3 for future-proofing and security
- chrome.storage for local persistence (no backend server)
- GitHub OAuth for secure authentication and API access
- Vite for fast development and build tooling

## Design Patterns in Use
- Component-based UI architecture (React)
- Separation of concerns: UI (popup, options, canvas) vs. background logic (background.js)
- Context/state management within React components
- Modular file structure for maintainability

## Component Relationships
- popup.html/options.html load React apps (src/popup.tsx, src/options.tsx)
- canvas.html loads the visual planning canvas (src/canvas.tsx, src/CanvasPage.tsx)
- background.js handles authentication, storage, and messaging between UI and background
- All UI components interact with chrome.storage and background scripts as needed
- Options page now includes fields for GitHub username, API key, and canvas settings
- Canvas page includes a project name input field and Save/Cancel buttons

## Critical Implementation Paths
- User authenticates with GitHub via popup; background.js manages OAuth flow
- User creates/edits visual plans on the canvas; data is saved to chrome.storage
- AI features are accessed via API key set in options; invoked from the UI
- Popup allows users to start a new plan (navigating to canvas) or load existing plans from chrome.storage

*Update this file as the architecture and patterns evolve.*

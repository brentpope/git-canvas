# System Patterns

## Architecture Overview
Git Canvas is structured as a Chrome Extension using Manifest V3. The extension consists of a popup UI, an options page, a visual canvas, and a background service worker. The UI is built with React and TypeScript, and the visual planning canvas uses React Flow. Persistent data is stored using chrome.storage. GitHub OAuth is handled via the background script and Chrome identity APIs.

## Key Technical Decisions
- Use of React and React Flow for a modern, interactive UI and visual canvas
- Chrome Extension Manifest V3 for future-proofing and security
- chrome.storage for local persistence (no backend server)
- GitHub OAuth for secure authentication and API access
- Vite for fast development and build tooling
- Configuration of GitHub Client ID in the options page for better distributable extension
- Guided setup flow for GitHub OAuth configuration

## Design Patterns in Use
- Component-based UI architecture (React)
- Separation of concerns: UI (popup, options, canvas) vs. background logic (background.js)
- Context/state management within React components
- Modular file structure for maintainability
- User-guided configuration flow for OAuth setup

## Component Relationships
- popup.html/options.html load React apps (src/popup.tsx, src/options.tsx)
- canvas.html loads the visual planning canvas (src/canvas.tsx, src/CanvasPage.tsx)
- background.js handles authentication, storage, and messaging between UI and background
- GitHubConnector.tsx manages repository selection and data fetching
- All UI components interact with chrome.storage and background scripts as needed
- Options page includes GitHub OAuth setup guide, Client ID configuration, username, token settings
- Canvas page visualizes GitHub repositories as interactive nodes with issues and directory structure

## Critical Implementation Paths
- User configures GitHub OAuth in the options page with the guided setup
- User authenticates with GitHub via canvas; background.js manages OAuth flow 
- GitHub repository data is fetched and visualized on the canvas as nodes and edges
- User creates/edits visual plans on the canvas; data is saved to chrome.storage
- AI features are accessed via API key set in options; invoked from the UI
- Popup allows users to start a new plan (navigating to canvas) or configure GitHub settings

## Archive
### Previous Version (2025-04-15)
- Original implementation focused on basic UI components
- Initial GitHub integration planning
- Simple project storage

*Update this file as the architecture and patterns evolve.*

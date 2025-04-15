# Tech Context

## Primary Technologies
- React (UI framework)
- TypeScript (type safety)
- Vite (build tool and dev server)
- React Flow (visual canvas)
- Chrome Extension APIs (Manifest V3)
- Chrome Storage API
- GitHub OAuth and API

## Development Setup
- Install dependencies with `npm install`
- Start development server with `npm run dev` (Vite)
- Build extension with `npm run build`
- Lint code with `npm run lint`
- Load the `dist` folder as an unpacked extension in Chrome for testing

## Technical Constraints
- Must comply with Chrome Extension Manifest V3 requirements
- Only supports Google Chrome (not other browsers)
- Uses chrome.storage for persistence (no backend server)
- OAuth and API access limited to GitHub

## Dependencies
- react, react-dom: UI rendering
- reactflow: visual canvas and node/edge management
- typescript: static typing
- vite: build and dev server
- eslint: code linting
- @vitejs/plugin-react, @types/react, @types/react-dom: development tooling

## Tool Usage Patterns
- Vite for fast development and hot module reloading
- ESLint for code quality and consistency
- TypeScript for type safety and maintainability
- Chrome Extension APIs for UI, storage, and background tasks

*Update this file as the tech stack or setup changes.*

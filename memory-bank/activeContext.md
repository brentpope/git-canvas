# Active Context

## Archived Status (2024-04-15)
### Focus
Initial documentation and memory bank setup. Reviewing and documenting the architecture, tech stack, and product context.

### Changes
- Populated all memory bank files with accurate project documentation
- Reviewed project structure, manifest, and dependencies
- Summarized system architecture and design patterns
- Added functionality to the popup for starting a new plan and loading existing plans
- Enhanced the options page with fields for GitHub username, API key, and canvas settings
- Updated the canvas page to include a project name input field and Save/Cancel buttons

### Next Steps
- Implement GitHub repository selection and tools for drawing objects on the canvas
- Refine the Save functionality to persist project data
- Test and debug the extension for seamless user experience
- Prepare for Chrome Web Store submission

## Current Status (2025-04-15)
### Focus
Implementing GitHub connectivity for the canvas feature to allow users to connect to their GitHub accounts, select repositories, and visualize them on the canvas.

### Recent Changes
- Created GitHubConnector component for repository selection and authentication
- Implemented GitHub OAuth flow in the background script
- Added guided setup for GitHub OAuth in the options page
- Enhanced the popup with GitHub setup notification
- Added visualization of GitHub repositories on the canvas with:
  - Repository structure as nodes
  - Issues as connected nodes
  - Directory/file organization
- Improved error handling for GitHub connectivity
- Moved GitHub Client ID configuration to options page for better distribution
- Added step-by-step OAuth setup guide for users

### Next Steps
- Enhance repository visualization with pull requests
- Add commit history visualization
- Improve the layout algorithm for complex repositories
- Add interactive editing tools for the canvas
- Implement AI assistance for documentation generation
- Add additional node types for different GitHub entities

## Active Decisions & Considerations
- GitHub Client ID configured in options page (not hardcoded) for better extension distribution
- OAuth flow needs a secure token exchange (currently simplified for prototype)
- Chrome identity API used for authentication flow
- Repository data stored with projects for offline viewing

## Patterns & Preferences
- React component-based architecture
- TypeScript for type safety
- Modular, maintainable file structure
- User-guided setup for complex configuration
- Clear error messages for authentication issues

## Insights & Learnings
- OAuth in Chrome extensions requires careful permission setup in manifest.json
- Chrome.identity.getRedirectURL() needs to be used for callback URLs
- Client IDs should be configurable, not hardcoded for distribution
- GitHub API requires proper error handling for rate limits and failed requests
- Repository visualization benefits from hierarchical organization

## Archive
### Previous Status (2025-04-15)
#### Focus
Improving GitHub connection stability and expanding canvas functionality. Project is approximately 55% complete.

#### Recent Changes
- Implemented GitHub OAuth authentication flow
- Added basic repository visualization on canvas
- Created project saving/loading with chrome.storage
- Built UI for popup, options, and canvas pages
- Added error handling for GitHub API calls

#### Next Steps
- Fine-tune GitHub connection reliability
- Expand canvas tools and drawing capabilities
- Improve repository structure visualization
- Add more project management features
- Enhance user experience across all pages

*Update this file frequently to reflect the current state and direction of the project.*

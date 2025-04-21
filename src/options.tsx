import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const Options = () => {
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [setupStep, setSetupStep] = useState(1);
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    // Get the redirect URL for OAuth setup
    if (chrome.identity && chrome.identity.getRedirectURL) {
      setRedirectUrl(chrome.identity.getRedirectURL());
    }
    
    chrome.storage.sync.get(
      [
        'githubUsername',
        'githubToken',
        'githubClientId', 
        'canvasTheme',
        'canvasGridlines',
        'defaultNodeStyle'
      ],
      (items) => {
        if (items.githubUsername) {
          (document.getElementById('github-username') as HTMLInputElement).value = items.githubUsername;
        }
        if (items.githubToken) {
          (document.getElementById('github-token') as HTMLInputElement).value = items.githubToken;
        }
        if (items.githubClientId) {
          (document.getElementById('github-client-id') as HTMLInputElement).value = items.githubClientId;
        }
        if (items.canvasTheme) {
          (document.getElementById('theme') as HTMLSelectElement).value = items.canvasTheme;
        }
        if (items.canvasGridlines) {
          (document.getElementById('gridlines') as HTMLSelectElement).value = items.canvasGridlines;
        }
        if (items.defaultNodeStyle) {
          (document.getElementById('node-style') as HTMLInputElement).value = items.defaultNodeStyle;
        }
      }
    );
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = (document.getElementById("github-username") as HTMLInputElement).value;
    const token = (document.getElementById("github-token") as HTMLInputElement).value;
    const clientId = (document.getElementById("github-client-id") as HTMLInputElement).value;
    const theme = (document.getElementById("theme") as HTMLSelectElement).value;
    const gridlines = (document.getElementById("gridlines") as HTMLSelectElement).value;
    const nodeStyle = (document.getElementById("node-style") as HTMLInputElement).value;

    chrome.storage.sync.set(
      {
        githubUsername: username,
        githubToken: token,
        githubClientId: clientId,
        canvasTheme: theme,
        canvasGridlines: gridlines,
        defaultNodeStyle: nodeStyle,
      },
      () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    );
  };

  // Guide user through setup steps
  const SetupGuide = () => {
    return (
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: 16, 
        borderRadius: 8, 
        marginBottom: 24,
        border: "1px solid #dee2e6"
      }}>
        <h3>GitHub Setup Guide</h3>
        
        <div style={{ display: "flex", marginBottom: 16 }}>
          {[1, 2, 3].map(step => (
            <div key={step} style={{ 
              cursor: "pointer",
              padding: "8px 16px", 
              backgroundColor: setupStep === step ? "#007bff" : "#e9ecef",
              color: setupStep === step ? "white" : "black",
              fontWeight: setupStep === step ? "bold" : "normal",
              marginRight: 8,
              borderRadius: 4
            }} onClick={() => setSetupStep(step)}>
              Step {step}
            </div>
          ))}
        </div>

        {setupStep === 1 && (
          <div>
            <h4>Create a GitHub OAuth App</h4>
            <ol style={{ paddingLeft: 20 }}>
              <li>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">GitHub Developer Settings</a></li>
              <li>Select "OAuth Apps" from the sidebar</li>
              <li>Click "New OAuth App" button</li>
              <li>Fill in the application details:
                <ul>
                  <li>Application name: "Git Canvas" (or your preferred name)</li>
                  <li>Homepage URL: You can use "https://github.com/your-username/git-canvas"</li>
                  <li>Application description: "Visual project planner for GitHub repositories"</li>
                  <li>Authorization callback URL: <code style={{ backgroundColor: "#e9ecef", padding: "2px 4px" }}>{redirectUrl}</code> (Copy this exactly)</li>
                </ul>
              </li>
              <li>Click "Register application"</li>
            </ol>
            <button onClick={() => setSetupStep(2)} style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4 }}>Continue to Step 2</button>
          </div>
        )}

        {setupStep === 2 && (
          <div>
            <h4>Configure Your OAuth App</h4>
            <ol style={{ paddingLeft: 20 }}>
              <li>After registering, you'll see your new OAuth App's details</li>
              <li>Copy the "Client ID" (you'll need this for the next step)</li>
              <li>Note: You don't need to generate a client secret for this extension</li>
              <li>Paste the Client ID in the "GitHub Client ID" field below</li>
            </ol>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setSetupStep(1)} style={{ padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: 4 }}>Back to Step 1</button>
              <button onClick={() => setSetupStep(3)} style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4 }}>Continue to Step 3</button>
            </div>
          </div>
        )}

        {setupStep === 3 && (
          <div>
            <h4>Complete Your Setup</h4>
            <ol style={{ paddingLeft: 20 }}>
              <li>Enter your GitHub username (optional)</li>
              <li>Remember to save your settings using the "Save Options" button</li>
              <li>You can now start using Git Canvas to visualize your repositories</li>
              <li>Open the extension and connect to GitHub from the canvas page</li>
            </ol>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setSetupStep(2)} style={{ padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: 4 }}>Back to Step 2</button>
              <button onClick={() => setShowSetupGuide(false)} style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4 }}>Finish Setup</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2>Git Canvas Options</h2>
      
      {!showSetupGuide ? (
        <button 
          onClick={() => setShowSetupGuide(true)}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#17a2b8", 
            color: "white", 
            border: "none", 
            borderRadius: 4,
            marginBottom: 16
          }}
        >
          Show GitHub Setup Guide
        </button>
      ) : (
        <SetupGuide />
      )}
      
      {saved && (
        <div style={{ 
          padding: "12px 16px", 
          backgroundColor: "#d4edda", 
          color: "#155724", 
          borderRadius: 4,
          marginBottom: 16
        }}>
          Options saved successfully!
        </div>
      )}
      
      <form
        style={{ marginTop: 16 }}
        onSubmit={handleFormSubmit}
      >
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="github-client-id" style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
            GitHub OAuth Client ID:
          </label>
          <input 
            id="github-client-id" 
            type="text" 
            placeholder="Enter your GitHub OAuth Client ID" 
            style={{ width: "100%", padding: 8 }} 
          />
          <small style={{ color: "#6c757d", display: "block", marginTop: 4 }}>
            Required for GitHub authentication. Get this from your GitHub OAuth App settings.
          </small>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="github-username" style={{ display: "block", marginBottom: 4 }}>
            GitHub Username:
          </label>
          <input id="github-username" type="text" placeholder="Enter your GitHub username" style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="github-token" style={{ display: "block", marginBottom: 4 }}>
            GitHub Personal Access Token (Optional):
          </label>
          <input id="github-token" type="password" placeholder="Enter your GitHub personal access token" style={{ width: "100%", padding: 8 }} />
          <small style={{ color: "#6c757d", display: "block", marginTop: 4 }}>
            Optional: Only needed for accessing private repositories or increased rate limits
          </small>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="theme" style={{ display: "block", marginBottom: 4 }}>
            Theme:
          </label>
          <select id="theme" style={{ width: "100%", padding: 8 }}>
            <option value="normal">Normal</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="gridlines" style={{ display: "block", marginBottom: 4 }}>
            Gridlines:
          </label>
          <select id="gridlines" style={{ width: "100%", padding: 8 }}>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="node-style" style={{ display: "block", marginBottom: 4 }}>
            Default Node Style:
          </label>
          <input id="node-style" type="text" placeholder="Enter default node style (e.g., color)" style={{ width: "100%", padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: 8, backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 4 }}>
          Save Options
        </button>
      </form>
    </div>
  );
};

const root = createRoot(document.getElementById("options-root")!);
root.render(<Options />);

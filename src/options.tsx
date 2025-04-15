import React from "react";
import { createRoot } from "react-dom/client";

const Options = () => {
  React.useEffect(() => {
    chrome.storage.sync.get(
      [
        'githubUsername',
        'githubToken', 
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

  return (
  <div style={{ minWidth: 320, minHeight: 180, padding: 16 }}>
    <h2>Git Canvas Options</h2>
    <form
      style={{ marginTop: 16 }}
      onSubmit={(e) => {
        e.preventDefault();
        const username = (document.getElementById("github-username") as HTMLInputElement).value;
        const token = (document.getElementById("github-token") as HTMLInputElement).value;
        const theme = (document.getElementById("theme") as HTMLSelectElement).value;
        const gridlines = (document.getElementById("gridlines") as HTMLSelectElement).value;
        const nodeStyle = (document.getElementById("node-style") as HTMLInputElement).value;

        chrome.storage.sync.set(
          {
            githubUsername: username,
            githubToken: token,
            canvasTheme: theme,
            canvasGridlines: gridlines,
            defaultNodeStyle: nodeStyle,
          },
          () => {
            alert("Options saved successfully!");
          }
        );
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="github-username" style={{ display: "block", marginBottom: 4 }}>
          GitHub Username:
        </label>
        <input id="github-username" type="text" placeholder="Enter your GitHub username" style={{ width: "100%", padding: 8 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="github-token" style={{ display: "block", marginBottom: 4 }}>
          GitHub API Key/Token:
        </label>
        <input id="github-token" type="password" placeholder="Enter your GitHub API key" style={{ width: "100%", padding: 8 }} />
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

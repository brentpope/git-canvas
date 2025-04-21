import { useState, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";

const Popup = () => {
  const [hasGithubConfig, setHasGithubConfig] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if GitHub Client ID is configured
    chrome.storage.sync.get(["githubClientId"], (data) => {
      setHasGithubConfig(!!data.githubClientId);
    });
  }, []);

  const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for browsers that don't support openOptionsPage
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  const openCanvas = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("canvas.html") });
  };
  
  return (
    <div style={{ minWidth: 320, minHeight: 180, padding: 16 }}>
      <h2>Git Canvas</h2>
      {!hasGithubConfig && (
        <div style={{ padding: 16, backgroundColor: "#fff3cd", borderRadius: 8, marginBottom: 16, borderLeft: "4px solid #ffc107" }}>
          <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold" }}>GitHub Setup Required</p>
          <p style={{ margin: "8px 0", fontSize: "0.9rem" }}>
            To visualize GitHub repositories, you need to complete the GitHub setup.
          </p>
          <button 
            onClick={openOptionsPage}
            style={{ 
              padding: "8px 12px", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: 4,
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            Complete GitHub Setup
          </button>
        </div>
      )}
      
      <p>Select a mode to begin:</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={openCanvas}
          style={{
            padding: "12px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>Canvas Mode</span>
          <span style={{ fontSize: "1.2rem" }}>→</span>
        </button>
        
        <button
          onClick={openOptionsPage}
          style={{
            padding: "12px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>Options & Settings</span>
          <span style={{ fontSize: "1.2rem" }}>⚙</span>
        </button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("popup-root")!);
root.render(<Popup />);

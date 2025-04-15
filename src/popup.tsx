import { createRoot } from "react-dom/client";

const Popup = () => (
  <div style={{ minWidth: 320, minHeight: 180, padding: 16 }}>
    <h2>Git Canvas</h2>
    <p>Select a mode to begin planning your project visually.</p>
    <div style={{ marginTop: 16 }}>
      <button
        style={{ marginRight: 8 }}
        onClick={() => {
          chrome.tabs.create({ url: chrome.runtime.getURL("canvas.html") });
        }}
      >
        Start New Plan
      </button>
      <button
        onClick={() => {
          chrome.storage.sync.get("plans", (data: { plans?: string[] }) => {
            if (data.plans) {
              alert("Existing Plans: " + JSON.stringify(data.plans));
            } else {
              alert("No existing plans found.");
            }
          });
        }}
      >
        Load Existing Plan
      </button>
    </div>
  </div>
);

const root = createRoot(document.getElementById("popup-root")!);
root.render(<Popup />);

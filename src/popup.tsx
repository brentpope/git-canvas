import { createRoot } from "react-dom/client";

const Popup = () => (
  <div style={{ minWidth: 320, minHeight: 180, padding: 16 }}>
    <h2>Git Canvas</h2>
    <p>Select a mode to begin planning your project visually.</p>
    {/* Mode selection UI will go here */}
  </div>
);

const root = createRoot(document.getElementById("popup-root")!);
root.render(<Popup />);

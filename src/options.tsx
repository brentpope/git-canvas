import { createRoot } from "react-dom/client";

const Options = () => (
  <div style={{ minWidth: 320, minHeight: 180, padding: 16 }}>
    <h2>Git Canvas Options</h2>
    <p>Configure your AI API key and extension preferences here.</p>
    {/* Options form will go here */}
  </div>
);

const root = createRoot(document.getElementById("options-root")!);
root.render(<Options />);

 import { createRoot } from "react-dom/client";
 import CanvasPage from "./CanvasPage";
 import { ReactFlowProvider } from "reactflow"; // Import the provider
 
 const root = createRoot(document.getElementById("canvas-root")!);
 root.render(
   <ReactFlowProvider> {/* Wrap CanvasPage with the provider */}
     <CanvasPage />
   </ReactFlowProvider>
 );

import { createRoot } from "react-dom/client";
import CanvasPage from "./CanvasPage";

const root = createRoot(document.getElementById("canvas-root")!);
root.render(<CanvasPage />);

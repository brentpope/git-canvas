import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 100, y: 100 }, data: { label: "Repository Node" }, type: "default" },
];
const initialEdges: any[] = [];

const CanvasPage = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <ReactFlow nodes={initialNodes} edges={initialEdges} fitView />
  </div>
);

export default CanvasPage;

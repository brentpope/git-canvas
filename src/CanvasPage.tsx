import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 100, y: 100 }, data: { label: "Repository Node" }, type: "default" },
];
const initialEdges: any[] = [];

const CanvasPage = () => {
  const handleSave = () => {
    const projectName = (document.getElementById("project-name") as HTMLInputElement).value;
    alert(`Project "${projectName}" saved!`);
  };

  const handleCancel = () => {
    (document.getElementById("project-name") as HTMLInputElement).value = "";
    alert("Project creation canceled.");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 16, backgroundColor: "#f0f0f0", borderBottom: "1px solid #ccc" }}>
        <input
          id="project-name"
          type="text"
          placeholder="Enter project name"
          style={{ width: "60%", padding: 8, marginRight: 8 }}
        />
        <button onClick={handleSave} style={{ padding: 8, marginRight: 8 }}>
          Save
        </button>
        <button onClick={handleCancel} style={{ padding: 8 }}>
          Cancel
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow nodes={initialNodes} edges={initialEdges} fitView />
      </div>
    </div>
  );
};

export default CanvasPage;

import React from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

const CanvasPage = () => {
  const [nodes, setNodes] = React.useState<any[]>([]);
  const [edges, setEdges] = React.useState<any[]>([]);
  const [showLoadModal, setShowLoadModal] = React.useState(false);
  const [availableProjects, setAvailableProjects] = React.useState<string[]>([]);
  const [selectedProject, setSelectedProject] = React.useState('');

  const loadProjectsList = () => {
    chrome.storage.local.get(null, (items) => {
      const projects = Object.keys(items).filter(key => 
        key !== 'githubUsername' && items[key]?.nodes
      );
      setAvailableProjects(projects);
    });
  };

  React.useEffect(() => {
    loadProjectsList();
  }, []);
  const handleSave = () => {
    const projectName = (document.getElementById("project-name") as HTMLInputElement).value;
    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }
    
    const projectData = {
      nodes: nodes,
      edges: edges, 
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving project:', projectName, projectData);
    
    chrome.storage.local.set({ 
      [projectName]: projectData
    }, () => {
      chrome.storage.local.get(projectName, (result) => {
        console.log('Verify saved:', result);
        if (result[projectName]) {
          alert(`Project "${projectName}" saved successfully!`);
        } else {
          alert('Failed to save project!');
        }
      });
    });
  };

  const handleLoadProject = () => {
    if (!selectedProject) return;
    
    chrome.storage.local.get(selectedProject, (result) => {
      if (result[selectedProject]) {
        setNodes(result[selectedProject].nodes);
        setEdges(result[selectedProject].edges);
        (document.getElementById("project-name") as HTMLInputElement).value = selectedProject;
      }
      setShowLoadModal(false);
    });
  };

  const handleNewProject = () => {
    setNodes([]);
    setEdges([]);
    (document.getElementById("project-name") as HTMLInputElement).value = '';
    setShowLoadModal(false);
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
        <button 
          onClick={() => {
            loadProjectsList();
            setShowLoadModal(true);
          }} 
          style={{ padding: 8, marginRight: 8 }}
        >
          Load Project
        </button>
        <button onClick={handleSave} style={{ padding: 8, marginRight: 8 }}>
          Save
        </button>
        <button onClick={handleCancel} style={{ padding: 8 }}>
          Cancel
        </button>
      </div>
      {showLoadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            width: 400
          }}>
            <h3>Load Existing Project</h3>
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ width: '100%', padding: 8, margin: '10px 0' }}
            >
              <option value="">Select a project</option>
              {availableProjects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={handleNewProject} style={{ padding: '8px 16px' }}>
                New Project
              </button>
              <button 
                onClick={handleLoadProject} 
                style={{ padding: '8px 16px' }}
                disabled={!selectedProject}
              >
                Load Project
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView />
      </div>
    </div>
  );
};

export default CanvasPage;

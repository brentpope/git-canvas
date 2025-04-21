import React from "react";
import ReactFlow, { Node, Edge, Controls, Background, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import GitHubConnector from "./GitHubConnector";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string;
  html_url: string;
}

const CanvasPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [showLoadModal, setShowLoadModal] = React.useState(false);
  const [availableProjects, setAvailableProjects] = React.useState<string[]>([]);
  const [selectedProject, setSelectedProject] = React.useState('');
  const [currentRepo, setCurrentRepo] = React.useState<Repository | null>(null);

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
      createdAt: new Date().toISOString(),
      linkedRepository: currentRepo ? {
        id: currentRepo.id,
        full_name: currentRepo.full_name,
        url: currentRepo.html_url
      } : null
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
        
        // If project has linked repo data, update the state
        if (result[selectedProject].linkedRepository) {
          setCurrentRepo({
            id: result[selectedProject].linkedRepository.id,
            full_name: result[selectedProject].linkedRepository.full_name,
            html_url: result[selectedProject].linkedRepository.url,
            name: result[selectedProject].linkedRepository.full_name.split('/')[1],
            owner: {
              login: result[selectedProject].linkedRepository.full_name.split('/')[0]
            },
            description: ''
          });
        }
      }
      setShowLoadModal(false);
    });
  };

  const handleNewProject = () => {
    setNodes([]);
    setEdges([]);
    setCurrentRepo(null);
    (document.getElementById("project-name") as HTMLInputElement).value = '';
    setShowLoadModal(false);
  };

  const handleCancel = () => {
    (document.getElementById("project-name") as HTMLInputElement).value = "";
    alert("Project creation canceled.");
  };

  const handleRepositorySelect = (repoData: { structure: any, issues: any }, repoInfo: Repository) => {
    setCurrentRepo(repoInfo);
    
    // If the project name field is empty, suggest the repo name
    const projectNameInput = document.getElementById("project-name") as HTMLInputElement;
    if (!projectNameInput.value.trim()) {
      projectNameInput.value = repoInfo.name;
    }
    
    // Create nodes and edges from repository data
    generateGraphFromRepository(repoData);
  };

  const generateGraphFromRepository = (repoData: { structure: any, issues: any }) => {
    const { structure, issues } = repoData;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Create a node for the repository root
    const rootId = 'repo-root';
    newNodes.push({
      id: rootId,
      type: 'default',
      data: { label: currentRepo?.name || 'Repository' },
      position: { x: 250, y: 5 },
      style: {
        background: '#9EB3FF',
        padding: 10,
        borderRadius: 5
      }
    });
    
    // Process file structure
    if (structure && structure.tree) {
      // Group files by directory
      const directories: Record<string, string[]> = {};
      
      structure.tree.forEach((item: any) => {
        const path = item.path;
        const pathParts = path.split('/');
        
        if (pathParts.length === 1) {
          // Root level files/directories
          if (item.type === 'tree') {
            directories[item.path] = [];
          } else {
            directories[''] = directories[''] || [];
            directories[''].push(item.path);
          }
        } else {
          // Nested files - add to parent directory
          const dirPath = pathParts.slice(0, -1).join('/');
          if (item.type === 'blob') {
            directories[dirPath] = directories[dirPath] || [];
            directories[dirPath].push(path);
          }
        }
      });
      
      // Create nodes for top-level directories only to avoid clutter
      let xPos = 100;
      Object.keys(directories).forEach((dir) => {
        if (dir !== '') {
          const dirId = `dir-${dir.replace(/\//g, '-')}`;
          newNodes.push({
            id: dirId,
            data: { label: dir },
            position: { x: xPos, y: 100 },
            style: {
              background: '#FFFFC7',
              padding: 10,
              borderRadius: 5
            }
          });
          
          newEdges.push({
            id: `edge-root-${dirId}`,
            source: rootId,
            target: dirId,
            type: 'step'
          });
          
          xPos += 200;
        }
      });
    }
    
    // Add issues as nodes
    if (issues && issues.length) {
      const issuesNode = {
        id: 'issues',
        data: { label: 'Issues' },
        position: { x: 500, y: 100 },
        style: {
          background: '#FFCECE',
          padding: 10,
          borderRadius: 5
        }
      };
      
      newNodes.push(issuesNode);
      newEdges.push({
        id: `edge-root-issues`,
        source: rootId,
        target: 'issues',
        type: 'step'
      });
      
      // Add top 5 issues as child nodes
      const topIssues = issues.slice(0, 5);
      topIssues.forEach((issue: any, index: number) => {
        const issueId = `issue-${issue.number}`;
        newNodes.push({
          id: issueId,
          data: { 
            label: `#${issue.number}: ${issue.title.slice(0, 30)}${issue.title.length > 30 ? '...' : ''}` 
          },
          position: { x: 500, y: 200 + (index * 70) },
          style: {
            background: issue.state === 'open' ? '#FFCECE' : '#E2E2E2',
            padding: 10,
            borderRadius: 5,
            fontSize: '12px',
            width: 200
          }
        });
        
        newEdges.push({
          id: `edge-issues-${issueId}`,
          source: 'issues',
          target: issueId,
          type: 'straight'
        });
      });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 16, backgroundColor: "#f0f0f0", borderBottom: "1px solid #ccc" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
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
        
        {/* GitHub Connection Section */}
        <GitHubConnector onRepositorySelect={handleRepositorySelect} />
        
        {currentRepo && (
          <div style={{ padding: "8px 0", color: "#0366d6" }}>
            <strong>Linked Repository:</strong> {currentRepo.full_name}
            {currentRepo.description && <p style={{ fontSize: '0.9em', margin: '4px 0' }}>{currentRepo.description}</p>}
          </div>
        )}
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
        <ReactFlow 
          nodes={nodes} 
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CanvasPage;

import React, { useState, useEffect } from "react";

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

interface GitHubConnectorProps {
  onRepositorySelect: (repoData: { structure: any, issues: any }, repoInfo: Repository) => void;
}

const GitHubConnector: React.FC<GitHubConnectorProps> = ({ onRepositorySelect }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [hasClientId, setHasClientId] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated with GitHub
    chrome.storage.sync.get(["githubToken", "githubUserData", "githubClientId"], (data) => {
      if (data.githubToken && data.githubUserData) {
        setIsAuthenticated(true);
        setUsername(data.githubUserData.login || "GitHub User");
        fetchRepositories();
      }
      
      // Check if Client ID is configured in options
      setHasClientId(!!data.githubClientId);
    });
  }, []);

  const handleAuthenticate = () => {
    setLoading(true);
    setError(null);
    
    chrome.runtime.sendMessage({ action: "authenticateWithGitHub" }, (response) => {
      setLoading(false);
      
      if (response && response.success) {
        setIsAuthenticated(true);
        fetchUserData();
        fetchRepositories();
      } else {
        // Improved error handling to display better error messages
        if (response && response.error) {
          if (typeof response.error === 'object') {
            // If error is an object, extract meaningful properties
            setError(JSON.stringify(response.error, ['message', 'name', 'stack'], 2));
          } else {
            setError(response.error);
          }
        } else if (chrome.runtime.lastError) {
          setError(`Chrome runtime error: ${chrome.runtime.lastError.message}`);
        } else {
          setError("Authentication failed. Please check the console for more details.");
        }
        console.error("GitHub authentication error:", response?.error || "Unknown error");
      }
    });
  };

  const fetchUserData = () => {
    chrome.storage.sync.get(["githubUserData"], (data) => {
      if (data.githubUserData) {
        setUsername(data.githubUserData.login || "GitHub User");
      }
    });
  };

  const fetchRepositories = () => {
    setLoading(true);
    setError(null);
    
    chrome.runtime.sendMessage({ action: "fetchUserRepositories" }, (response) => {
      setLoading(false);
      
      if (response && response.success) {
        setRepositories(response.repositories || []);
      } else {
        setError(response?.error || "Failed to fetch repositories");
      }
    });
  };

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepo(repo);
    setLoading(true);
    setError(null);
    
    chrome.runtime.sendMessage({
      action: "fetchRepositoryData",
      data: {
        owner: repo.owner.login,
        repo: repo.name
      }
    }, (response) => {
      setLoading(false);
      
      if (response && response.success) {
        onRepositorySelect(response.repositoryData, repo);
      } else {
        setError(response?.error || "Failed to fetch repository data");
      }
    });
  };

  // Opens the extension options page to configure GitHub
  const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for browsers that don't support openOptionsPage
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  return (
    <div style={{ padding: 16, backgroundColor: "#f8f9fa", borderRadius: 8, marginBottom: 16 }}>
      <h3>GitHub Connection</h3>
      
      {!isAuthenticated ? (
        <div>
          <p>Connect to GitHub to visualize repositories</p>
          
          {!hasClientId ? (
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: "#f8d7da", borderRadius: 4, color: "#721c24" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>GitHub Client ID not configured</p>
              <p style={{ margin: "0 0 8px 0" }}>
                You need to set up your GitHub OAuth App before connecting to GitHub.
              </p>
              <button
                onClick={openOptionsPage}
                style={{ 
                  padding: "8px 16px", 
                  backgroundColor: "#28a745", 
                  color: "white", 
                  border: "none", 
                  borderRadius: 4 
                }}
              >
                Open Setup Guide
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAuthenticate}
              disabled={loading}
              style={{ padding: 8 }}
            >
              {loading ? "Connecting..." : "Connect to GitHub"}
            </button>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: "bold", marginRight: 8 }}>Connected as: {username}</span>
            <button 
              onClick={fetchRepositories}
              disabled={loading}
              style={{ padding: 4, fontSize: "0.85em" }}
            >
              Refresh
            </button>
          </div>
          
          {repositories.length > 0 ? (
            <div>
              <label htmlFor="repository-select">Select a repository to visualize:</label>
              <select
                id="repository-select"
                onChange={(e) => {
                  const repo = repositories.find(r => r.id.toString() === e.target.value);
                  if (repo) handleRepositorySelect(repo);
                }}
                value={selectedRepo?.id || ""}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                disabled={loading}
              >
                <option value="">-- Select Repository --</option>
                {repositories.map(repo => (
                  <option key={repo.id} value={repo.id}>
                    {repo.full_name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>No repositories found. {repositories === null ? "Failed to load repositories." : ""}</p>
          )}
        </div>
      )}
      
      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </div>
  );
};

export default GitHubConnector;
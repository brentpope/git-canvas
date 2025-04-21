// background.js for Git Canvas Chrome Extension

// GitHub OAuth configuration - will be loaded from storage
let GITHUB_CLIENT_ID = null; 
const GITHUB_SCOPE = "repo";

// Try to load GitHub client ID from storage when background script initializes
chrome.storage.sync.get(["githubClientId"], (data) => {
  if (data.githubClientId) {
    GITHUB_CLIENT_ID = data.githubClientId;
    console.log("Loaded GitHub Client ID from storage");
  } else {
    console.log("No GitHub Client ID found in storage");
  }
});

// Function to get the redirect URL for GitHub OAuth
function getRedirectURL() {
  return chrome.identity.getRedirectURL();
}

// Handle authentication with GitHub using Chrome's identity API
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getRedirectURL") {
    sendResponse({ url: getRedirectURL() });
    return false;
  }

  if (message.action === "setGitHubClientId") {
    const clientId = message.clientId;
    if (!clientId) {
      sendResponse({ success: false, error: "Client ID is required" });
      return false;
    }

    GITHUB_CLIENT_ID = clientId;
    chrome.storage.sync.set({ githubClientId: clientId }, () => {
      sendResponse({ success: true });
    });
    return true; // Keep the message channel open for async response
  }

  if (message.action === "authenticateWithGitHub") {
    // First check if we have a valid client ID by getting the latest from storage
    chrome.storage.sync.get(["githubClientId"], (data) => {
      GITHUB_CLIENT_ID = data.githubClientId || null;
      
      if (!GITHUB_CLIENT_ID) {
        console.error("Missing GitHub Client ID. Please configure it in the options page.");
        sendResponse({ 
          success: false, 
          error: "GitHub Client ID not configured. Please go to extension options and set up your GitHub OAuth App." 
        });
        return;
      }
      
      authenticateWithGitHub()
        .then(token => {
          chrome.storage.sync.set({ githubToken: token }, () => {
            sendResponse({ success: true, token });
          });
          fetchUserInfo(token).then(userData => {
            chrome.storage.sync.set({ githubUserData: userData });
          });
        })
        .catch(error => {
          console.error("GitHub authentication failed:", error);
          sendResponse({ success: false, error: error.toString() });
        });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (message.action === "fetchUserRepositories") {
    chrome.storage.sync.get(["githubToken"], (data) => {
      if (data.githubToken) {
        fetchUserRepositories(data.githubToken).then(repos => {
          sendResponse({ success: true, repositories: repos });
        }).catch(error => {
          console.error("Failed to fetch repositories:", error);
          sendResponse({ success: false, error: error.toString() });
        });
      } else {
        sendResponse({ success: false, error: "Not authenticated with GitHub" });
      }
    });
    return true; // Keep the message channel open for async response
  }

  if (message.action === "fetchRepositoryData") {
    const { owner, repo } = message.data;
    chrome.storage.sync.get(["githubToken"], (data) => {
      if (data.githubToken) {
        Promise.all([
          fetchRepositoryStructure(data.githubToken, owner, repo),
          fetchRepositoryIssues(data.githubToken, owner, repo)
        ]).then(([structure, issues]) => {
          sendResponse({ 
            success: true, 
            repositoryData: {
              structure,
              issues
            }
          });
        }).catch(error => {
          console.error("Failed to fetch repository data:", error);
          sendResponse({ success: false, error: error.toString() });
        });
      } else {
        sendResponse({ success: false, error: "Not authenticated with GitHub" });
      }
    });
    return true; // Keep the message channel open for async response
  }
});

// GitHub OAuth authentication
async function authenticateWithGitHub() {
  // Make sure we have the latest client ID
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["githubClientId"], async (data) => {
      if (!data.githubClientId) {
        reject(new Error("GitHub Client ID not configured"));
        return;
      }
      
      GITHUB_CLIENT_ID = data.githubClientId;
      const authURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(getRedirectURL())}&scope=${GITHUB_SCOPE}`;
      
      try {
        const responseUrl = await new Promise((resolveAuth, rejectAuth) => {
          chrome.identity.launchWebAuthFlow({
            url: authURL,
            interactive: true
          }, (response) => {
            if (chrome.runtime.lastError) {
              rejectAuth(chrome.runtime.lastError);
              return;
            }
            
            if (!response) {
              rejectAuth(new Error("Authentication failed - no response URL"));
              return;
            }
            
            resolveAuth(response);
          });
        });
        
        // Extract the authorization code from the response URL
        const url = new URL(responseUrl);
        const code = url.searchParams.get("code");
        
        if (!code) {
          reject(new Error("No authorization code found in the response"));
          return;
        }
        
        // Exchange the code for an access token
        const token = await exchangeCodeForToken(code);
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Exchange authorization code for an access token
async function exchangeCodeForToken(code) {
  // Note: In a production environment, this should be done server-side
  // for security reasons. This client-side implementation is simplified
  // for demonstration purposes.
  const tokenUrl = "https://github.com/login/oauth/access_token";
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      code: code,
      redirect_uri: getRedirectURL()
    })
  });
  
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.access_token;
}

// Fetch user information once authenticated
async function fetchUserInfo(token) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github.v3+json"
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Fetch user repositories
async function fetchUserRepositories(token) {
  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github.v3+json"
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Fetch repository structure (files and directories)
async function fetchRepositoryStructure(token, owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github.v3+json"
    }
  });
  
  if (!response.ok) {
    // If main branch fails, try master as fallback
    const fallbackResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`, {
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });
    
    if (!fallbackResponse.ok) {
      throw new Error(`Failed to fetch repository structure: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
    }
    
    return await fallbackResponse.json();
  }
  
  return await response.json();
}

// Fetch repository issues
async function fetchRepositoryIssues(token, owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`, {
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github.v3+json"
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repository issues: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}
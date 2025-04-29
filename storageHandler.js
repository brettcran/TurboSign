// === storageHandler.js ===
// Handles LocalStorage: Recent Files Management

const RECENT_FILES_KEY = 'recentFiles';
const CURRENT_FILE_KEY = 'currentFile';
const MAX_RECENT_FILES = 5;

// Load recent files into Landing Page
function loadRecentFiles() {
  const list = document.getElementById('recent-list');
  if (!list) return;

  const recent = JSON.parse(localStorage.getItem(RECENT_FILES_KEY) || '[]');
  list.innerHTML = '';

  if (recent.length === 0) {
    const li = document.createElement('li');
    li.innerText = 'No recent documents';
    list.appendChild(li);
  } else {
    recent.forEach(name => {
      const li = document.createElement('li');
      li.innerText = name;
      list.appendChild(li);
    });
  }
}

// Update Recent Files after Upload
function updateRecentFiles(name) {
  let recent = JSON.parse(localStorage.getItem(RECENT_FILES_KEY) || '[]');
  recent.unshift(name);
  recent = [...new Set(recent)]; // Remove duplicates

  if (recent.length > MAX_RECENT_FILES) {
    recent = recent.slice(0, MAX_RECENT_FILES);
  }

  localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(recent));
}

// Save Current File (for editor.html tracking)
function saveCurrentFile(name) {
  localStorage.setItem(CURRENT_FILE_KEY, name);
}

// Get Current File
function getCurrentFile() {
  return localStorage.getItem(CURRENT_FILE_KEY);
}

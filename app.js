// scripts/app.js

// Handle PDF file upload (index and editor pages)
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file || file.type !== 'application/pdf') return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    sessionStorage.setItem('pdfData', ev.target.result);
    sessionStorage.setItem('pdfName', file.name);
    // If on editor page, reload PDF, else navigate
    if (document.getElementById('pdf-container')) {
      loadPDF();
    } else {
      window.location.href = 'editor.html';
    }
  };
  reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', () => {
  // Index page upload & help
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
  }
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeHelp = document.getElementById('close-help');
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => helpModal.classList.add('active'));
  }
  if (closeHelp && helpModal) {
    closeHelp.addEventListener('click', () => helpModal.classList.remove('active'));
  }

  // Bind upload button (index)
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
  }
  // Embedded upload (editor)
  const embedInput = document.getElementById('file-input-embed');
  if (embedInput) {
    embedInput.addEventListener('change', handleFileUpload);
  }
  // Help modal toggling
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeHelp = document.getElementById('close-help');
  if (helpBtn && helpModal) helpBtn.addEventListener('click', () => helpModal.classList.add('active'));
  if (closeHelp && helpModal) closeHelp.addEventListener('click', () => helpModal.classList.remove('active'));
  // Editor page logic
  const pdfContainer = document.getElementById('pdf-container');
  if (!pdfContainer) return;
  if (sessionStorage.getItem('pdfData')) loadPDF();
  window.scale = 1;
  window.lastClick = { x: 0, y: 0 };
  pdfContainer.addEventListener('mousedown', e => {
    const rect = pdfContainer.getBoundingClientRect();
    window.lastClick = {
      x: (e.clientX - rect.left) / window.scale,
      y: (e.clientY - rect.top) / window.scale
    };
  });
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      switch (action) {
        case 'upload':
          document.getElementById('file-input-embed').click();
          break;
        case 'text':
          createTextBoxAt(window.lastClick.x, window.lastClick.y);
          break;
        case 'sign':
          openSignatureModal();
          break;
        case 'add-text':
          createTextBoxAt(window.lastClick.x, window.lastClick.y);
          break;
        case 'add-signature':
          openSignatureModal();
          break;
        case 'save':
          savePDF();
          break;
        case 'zoom-in':
          window.scale += 0.2;
          pdfContainer.style.transform = `scale(${window.scale})`;
          break;
        case 'zoom-out':
          if (window.scale > 1) {
            window.scale -= 0.2;
            pdfContainer.style.transform = `scale(${window.scale})`;
          }
          break;
        case 'help':
          helpModal.classList.add('active');
          break;
        default:
          console.warn('Unknown action:', action);
      }
    });
  });
});

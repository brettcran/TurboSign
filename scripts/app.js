// scripts/app.js

// Handle PDF file upload (index page)
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    const reader = new FileReader();
    reader.onload = function(event) {
      sessionStorage.setItem('pdfData', event.target.result);
      sessionStorage.setItem('pdfName', file.name);
      window.location.href = 'editor.html';
    };
    reader.readAsDataURL(file);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Help modal toggling
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeHelp = document.getElementById('close-help');
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => helpModal.classList.add('active'));
  }
  if (closeHelp && helpModal) {
    closeHelp.addEventListener('click', () => helpModal.classList.remove('active'));
  }

  // Index page upload
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
  }

  // Editor page logic
  const pdfContainer = document.getElementById('pdf-container');
  if (pdfContainer) {
    // Load PDF if present
    if (sessionStorage.getItem('pdfData')) {
      loadPDF();
    }
    let scale = 1.0;
    let lastClick = { x: 0, y: 0 };
    // Track click for annotations
    pdfContainer.addEventListener('mousedown', e => {
      const rect = pdfContainer.getBoundingClientRect();
      lastClick = {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale
      };
    });
    // Bind toolbar action buttons
    const toolbarBtns = document.querySelectorAll('[data-action]');
    toolbarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        switch (action) {
          case 'upload':
            document.getElementById('file-input-embed').click();
            break;
          case 'text':
            createTextBoxAt(lastClick.x, lastClick.y);
            break;
          case 'sign':
            openSignatureModal();
            break;
          case 'save':
            savePDF();
            break;
          case 'zoom-in':
            zoomIn();
            break;
          case 'zoom-out':
            zoomOut();
            break;
          case 'help':
            helpModal.classList.add('active');
            break;
          default:
            console.warn('Unknown action:', action);
        }
      });
    });
    // Embedded upload in editor
    const fileInputEmbed = document.getElementById('file-input-embed');
    if (fileInputEmbed) {
      fileInputEmbed.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = function(event) {
            sessionStorage.setItem('pdfData', event.target.result);
            sessionStorage.setItem('pdfName', file.name);
            loadPDF();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
});
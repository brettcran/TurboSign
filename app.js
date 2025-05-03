// scripts/app.js

document.addEventListener('DOMContentLoaded', () => {
  const pdfContainer = document.getElementById('pdf-container');
  window.scale = 1;
  window.lastClick = { x: 0, y: 0 };

  console.log("PDFill-Sign: DOM Ready");

  // Always bind toolbar actions
  const toolbarButtons = document.querySelectorAll('[data-action]');
  console.log("Binding toolbar actions:", toolbarButtons.length);
  toolbarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      console.log("Toolbar action triggered:", action);
      switch (action) {
        case 'upload':
          document.getElementById('file-input-embed')?.click();
          break;
        case 'text':
          createTextBoxAt(window.lastClick.x, window.lastClick.y);
          break;
        case 'sign':
          openSignatureModal();
          break;
        case 'check':
          insertSymbol('✔');
          break;
        case 'xmark':
          insertSymbol('✘');
          break;
        case 'circle':
          insertCircle();
          break;
        case 'zoom-in':
          window.scale += 0.2;
          if (pdfContainer) pdfContainer.style.transform = `scale(${window.scale})`;
          break;
        case 'zoom-out':
          if (window.scale > 0.4) {
            window.scale -= 0.2;
            if (pdfContainer) pdfContainer.style.transform = `scale(${window.scale})`;
          }
          break;
        case 'export':
          savePDF();
          break;
        case 'delete':
          toggleDeleteMode();
          break;
        case 'help':
          document.getElementById('help-modal')?.classList.add('active');
          break;
        default:
          console.warn("Unknown action:", action);
      }
    });
  });

  if (pdfContainer) {
    pdfContainer.addEventListener('mousedown', e => {
      const rect = pdfContainer.getBoundingClientRect();
      window.lastClick = {
        x: (e.clientX - rect.left) / window.scale,
        y: (e.clientY - rect.top) / window.scale
      };
    });
  }

  document.getElementById('close-help')?.addEventListener('click', () => {
    document.getElementById('help-modal')?.classList.remove('active');
  });

  document.getElementById('close-signature')?.addEventListener('click', () => {
    document.getElementById('signature-modal')?.classList.remove('active');
  });

  document.getElementById('file-input-embed')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      sessionStorage.setItem('pdfData', ev.target.result);
      sessionStorage.setItem('pdfName', file.name);
      location.reload();
    };
    reader.readAsDataURL(file);
  });

  if (sessionStorage.getItem('pdfData')) {
    loadPDF();
  }
});

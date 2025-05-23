// scripts/app.js

document.addEventListener('DOMContentLoaded', () => {
  const pdfContainer = document.getElementById('pdf-container');
  window.scale = 1;
  window.lastClick = { x: 0, y: 0 };

  console.log("PDFill-Sign: DOM Ready");

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

// On-screen debug log overlay
(function createDebugOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "debug-log";
  overlay.style.position = "fixed";
  overlay.style.bottom = "0";
  overlay.style.left = "0";
  overlay.style.right = "0";
  overlay.style.maxHeight = "30vh";
  overlay.style.overflowY = "auto";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.color = "lime";
  overlay.style.fontSize = "12px";
  overlay.style.fontFamily = "monospace";
  overlay.style.padding = "5px";
  overlay.style.zIndex = "99999";
  document.body.appendChild(overlay);

  const log = console.log;
  console.log = function (...args) {
    log.apply(console, args);
    overlay.innerHTML += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + "<br>";
    overlay.scrollTop = overlay.scrollHeight;
  };

  const warn = console.warn;
  console.warn = function (...args) {
    warn.apply(console, args);
    overlay.innerHTML += "<span style='color:yellow'>" + args.join(" ") + "</span><br>";
    overlay.scrollTop = overlay.scrollHeight;
  };
})();

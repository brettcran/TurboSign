// scripts/app.js

let lastClick = { x: 100, y: 100 };

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById('file-input') || document.getElementById('upload-btn');
  const helpBtn = document.getElementById('help-btn');
  const closeHelp = document.getElementById('close-help');
  const closeSignature = document.getElementById('close-signature');
  const toolbar = document.getElementById('toolbar');
  const pdfContainer = document.getElementById('pdf-container');

  if (fileInput && fileInput.tagName === "INPUT") {
    fileInput.addEventListener('change', handleFileUpload);
  } else if (fileInput && fileInput.tagName === "BUTTON") {
    fileInput.addEventListener('click', triggerFileInput);
  }

  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      document.getElementById('help-modal').style.display = 'flex';
    });
  }

  if (closeHelp) {
    closeHelp.addEventListener('click', () => {
      document.getElementById('help-modal').style.display = 'none';
    });
  }

  if (closeSignature) {
    closeSignature.addEventListener('click', () => {
      document.getElementById('signature-modal').style.display = 'none';
    });
  }

  if (toolbar) {
    toolbar.addEventListener('click', (e) => {
      if (e.target.dataset.action) {
        handleToolbarAction(e.target.dataset.action);
      }
    });
  }

  if (pdfContainer) {
    pdfContainer.addEventListener('click', (e) => {
      lastClick = { x: e.offsetX, y: e.offsetY };
    });
  }
});

function triggerFileInput() {
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'file';
  hiddenInput.accept = 'application/pdf';
  hiddenInput.style.display = 'none';
  hiddenInput.addEventListener('change', handleFileUpload);
  document.body.appendChild(hiddenInput);
  hiddenInput.click();
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    const reader = new FileReader();
    reader.onload = (event) => {
      sessionStorage.setItem('pdfData', event.target.result);
      sessionStorage.setItem('pdfName', file.name);
      window.location.href = 'editor.html';
    };
    reader.readAsDataURL(file);
  }
}

function handleToolbarAction(action) {
  switch (action) {
    case "upload":
      triggerFileInput();
      break;
    case "save":
      savePDF();
      break;
    case "text":
      createTextBoxAt(lastClick.x, lastClick.y);
      break;
    case "sign":
      openSignatureModal();
      break;
    case "undo":
      undo();
      break;
    case "redo":
      redo();
      break;
    case "zoom-in":
      zoomIn();
      break;
    case "zoom-out":
      zoomOut();
      break;
    case "help":
      document.getElementById('help-modal').style.display = 'flex';
      break;
  }
}

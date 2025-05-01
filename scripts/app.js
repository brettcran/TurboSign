// scripts/app.js

document.addEventListener('DOMContentLoaded', () => {
  // Open PDF functionality
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file || file.type !== 'application/pdf') return;
      const reader = new FileReader();
      reader.onload = ev => {
        sessionStorage.setItem('pdfData', ev.target.result);
        sessionStorage.setItem('pdfName', file.name);
        window.location.href = 'editor.html';
      };
      reader.readAsDataURL(file);
    });
  }

  // Help modal toggle
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeHelp = document.getElementById('close-help');
  if (helpBtn && helpModal && closeHelp) {
    helpBtn.addEventListener('click', () => helpModal.classList.add('active'));
    closeHelp.addEventListener('click', () => helpModal.classList.remove('active'));
  }
});

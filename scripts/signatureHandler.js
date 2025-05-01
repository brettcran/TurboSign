// scripts/signatureHandler.js

let signaturePad;
let savedSignatures = JSON.parse(localStorage.getItem('savedSignatures') || '[]');

// Load signature thumbnails
function loadSavedSignaturesUI() {
  const container = document.getElementById('saved-signatures');
  container.innerHTML = '';
  savedSignatures.forEach((dataUrl, idx) => {
    const thumb = document.createElement('img');
    thumb.src = dataUrl;
    thumb.className = 'sig-thumb';
    thumb.addEventListener('click', () => {
      insertSignature(dataUrl);
      closeSignatureModal();
    });
    container.appendChild(thumb);
  });
}

// Insert a signature onto the PDF
function insertSignature(dataUrl) {
  const img = document.createElement('img');
  img.src = dataUrl;
  img.className = 'signature-image';
  img.style.position = 'absolute';
  img.style.top = `${lastClick.y}px`;
  img.style.left = `${lastClick.x}px`;
  document.getElementById('pdf-container').appendChild(img);
  makeElementDraggable(img);
}

// Clear signature pad
function clearSignature() {
  if (signaturePad) signaturePad.clear();
}

// Close modal
function closeSignatureModal() {
  document.getElementById('signature-modal').classList.remove('active');
}

// Open signature drawing modal
function openSignatureModal() {
  const modal = document.getElementById('signature-modal');
  modal.classList.add('active');
  const wrapper = document.getElementById('signature-pad-wrapper');
  const canvas = document.getElementById('signature-pad');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = wrapper.clientWidth * ratio;
  canvas.height = wrapper.clientHeight * ratio;
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgba(0,0,0,0)'
  });
  loadSavedSignaturesUI();
  document.getElementById('save-signature').onclick = () => {
    const dataUrl = signaturePad.toDataURL();
    savedSignatures.push(dataUrl);
    if (savedSignatures.length > 3) savedSignatures.shift();
    localStorage.setItem('savedSignatures', JSON.stringify(savedSignatures));
    insertSignature(dataUrl);
    closeSignatureModal();
  };
  document.getElementById('clear-signature').onclick = clearSignature;
  document.getElementById('close-signature').onclick = closeSignatureModal;
}

window.openSignatureModal = openSignatureModal;
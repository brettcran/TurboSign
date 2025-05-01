// scripts/signatureHandler.js

let signaturePad;
let savedSignatures = JSON.parse(localStorage.getItem('savedSignatures') || '[]');

// Global saveSignature function
function saveSignature() {
const data = signaturePad.toDataURL();
    savedSignatures.push(data);
    if (savedSignatures.length > 3) savedSignatures.shift();
    localStorage.setItem('savedSignatures', JSON.stringify(savedSignatures));
    insertSignature(data);
    closeSignatureModal();
}
window.saveSignature = saveSignature;


// Load saved signature thumbnails
function loadSavedSignaturesUI() {
  const cont = document.getElementById('saved-signatures');
  cont.innerHTML = '';
  savedSignatures.forEach(dataUrl => {
    const thumb = document.createElement('img');
    thumb.src = dataUrl;
    thumb.className = 'sig-thumb';
    thumb.addEventListener('click', () => {
      insertSignature(dataUrl);
      closeSignatureModal();
    });
    cont.appendChild(thumb);
  });
}

// Insert a signature into the PDF container
function insertSignature(dataUrl) {
  const img = document.createElement('img');
  img.src = dataUrl;
  img.className = 'signature-image';
  img.style.position = 'absolute';
  img.style.left = window.lastClick.x + 'px';
  img.style.top = window.lastClick.y + 'px';
  makeDraggable(img);
  document.getElementById('pdf-container').appendChild(img);
}

// Clear the signature pad canvas
function clearSignature() {
  if (signaturePad) signaturePad.clear();
}

// Close the signature modal
function closeSignatureModal() {
  document.getElementById('signature-modal').classList.remove('active');
}

// Open the signature drawing modal
function openSignatureModal() {
  const modalEl = document.getElementById('signature-modal');
  modalEl.classList.add('active');
  const wrapper = document.getElementById('signature-pad-wrapper');
  const canvas = document.getElementById('signature-pad');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = wrapper.clientWidth * ratio;
  canvas.height = wrapper.clientHeight * ratio;
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  signaturePad = new SignaturePad(canvas, { backgroundColor: 'rgba(0,0,0,0)' });
  loadSavedSignaturesUI();
  document.getElementById('save-signature').onclick = saveSignature;
  document.getElementById('clear-signature').onclick = clearSignature;
  document.getElementById('close-signature').onclick = closeSignatureModal;
  window.openSignatureModal = openSignatureModal;
}

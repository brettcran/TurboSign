// scripts/signatureHandler.js

let signaturePad;

function openSignatureModal() {
  document.getElementById('signature-modal').style.display = 'flex';
  const canvas = document.getElementById('signature-pad');
  signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'white',
    penColor: 'black'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const saveSignatureBtn = document.getElementById('save-signature');
  const clearSignatureBtn = document.getElementById('clear-signature');
  const closeSignatureBtn = document.getElementById('close-signature');

  if (saveSignatureBtn) {
    saveSignatureBtn.addEventListener('click', saveSignature);
  }
  if (clearSignatureBtn) {
    clearSignatureBtn.addEventListener('click', () => signaturePad.clear());
  }
  if (closeSignatureBtn) {
    closeSignatureBtn.addEventListener('click', () => {
      document.getElementById('signature-modal').style.display = 'none';
    });
  }
});

function saveSignature() {
  if (signaturePad.isEmpty()) {
    alert("Please draw a signature first.");
    return;
  }
  const dataURL = signaturePad.toDataURL();
  const img = document.createElement('img');
  img.src = dataURL;
  img.className = 'signature-image';
  img.style.position = 'absolute';
  img.style.top = '150px';
  img.style.left = '100px';
  img.style.width = '150px';
  img.style.height = '60px';
  img.style.cursor = 'move';
  img.draggable = true;
  document.getElementById('pdf-container').appendChild(img);

  img.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', '');
  });

  img.addEventListener('dragend', (e) => {
    img.style.left = `${e.pageX - 75}px`;
    img.style.top = `${e.pageY - 30}px`;
  });

  document.getElementById('signature-modal').style.display = 'none';
}

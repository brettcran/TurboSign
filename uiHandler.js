// scripts/uiHandler.js

function makeDraggable(el) {
  let dragging = false, startX, startY, origX, origY;
  el.style.cursor = 'move';
  el.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    const rect = el.getBoundingClientRect();
    origX = rect.left; origY = rect.top;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  });
  function onMouseMove(e) {
    if (!dragging) return;
    el.style.left = origX + (e.clientX - startX) - el.parentElement.getBoundingClientRect().left + 'px';
    el.style.top = origY + (e.clientY - startY) - el.parentElement.getBoundingClientRect().top + 'px';
  }
  function onMouseUp() {
    dragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

// Create a draggable text box
function createTextBoxAt(x, y) {
  const tb = document.createElement('div');
  tb.className = 'text-box';
  tb.contentEditable = true;
  tb.style.position = 'absolute';
  tb.style.left = x + 'px';
  tb.style.top = y + 'px';
  document.getElementById('pdf-container').appendChild(tb);
  makeDraggable(tb);
  tb.focus();
}

// Insert checkmark or X symbol
function insertSymbol(char) {
  const el = document.createElement('div');
  el.className = 'symbol-box';
  el.innerText = char;
  el.style.left = window.lastClick.x + 'px';
  el.style.top = window.lastClick.y + 'px';
  document.getElementById('pdf-container').appendChild(el);
  makeDraggable(el);
}

// Insert resizable circle
function insertCircle() {
  const el = document.createElement('div');
  el.className = 'circle-box';
  el.style.left = window.lastClick.x + 'px';
  el.style.top = window.lastClick.y + 'px';
  document.getElementById('pdf-container').appendChild(el);
  makeDraggable(el);
}

let deleteMode = false;
function toggleDeleteMode() {
  deleteMode = !deleteMode;
  const container = document.getElementById('pdf-container');
  if (deleteMode) {
    container.classList.add('delete-mode');
    container.querySelectorAll('.text-box, .signature-image, .symbol-box, .circle-box').forEach(el => {
      el.addEventListener('click', deleteHandler);
    });
  } else {
    container.classList.remove('delete-mode');
    container.querySelectorAll('.text-box, .signature-image, .symbol-box, .circle-box').forEach(el => {
      el.removeEventListener('click', deleteHandler);
    });
  }
}

function deleteHandler(e) {
  if (deleteMode) {
    e.stopPropagation();
    e.target.remove();
  }
}

window.createTextBoxAt = createTextBoxAt;
window.insertSymbol = insertSymbol;
window.insertCircle = insertCircle;
window.toggleDeleteMode = toggleDeleteMode;

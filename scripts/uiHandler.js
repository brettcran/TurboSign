// scripts/uiHandler.js


// Utility: make an element draggable within container
function makeElementDraggable(el) {
  let isDragging = false, startX, startY, origX, origY;
  el.style.cursor = 'move';
  el.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = el.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  });
  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    el.style.left = (origX + dx - container.getBoundingClientRect().left) + 'px';
    el.style.top = (origY + dy - container.getBoundingClientRect().top) + 'px';
  }
  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

// Sidebar references
let currentTextBox = null;
const textSidebar = document.getElementById('text-sidebar');
const sidebarFontSelector = document.getElementById('sidebar-font-selector');
const sidebarFontSize = document.getElementById('sidebar-font-size');
const sidebarFontWeight = document.getElementById('sidebar-font-weight');
const sidebarRotateLeft = document.getElementById('sidebar-rotate-left');
const sidebarRotateRight = document.getElementById('sidebar-rotate-right');

// Show/hide sidebar
function showTextSidebar(x, y) {
  textSidebar.style.top = y + 'px';
  textSidebar.classList.add('visible');
}
function hideTextSidebar() {
  textSidebar.classList.remove('visible');
  currentTextBox = null;
}

// Bind sidebar to a text box
function bindTextBoxSidebar(textBox) {
  textBox.addEventListener('focus', () => {
    currentTextBox = textBox;
    const style = getComputedStyle(textBox);
    sidebarFontSelector.value = style.fontFamily.replace(/['"]/g, '');
    sidebarFontSize.value = parseInt(style.fontSize);
    sidebarFontWeight.value = style.fontWeight === '700' ? 'bold' : 'normal';
    const tbRect = textBox.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    showTextSidebar(tbRect.right - contRect.left + 5, tbRect.top - contRect.top);
  });
  
}

// Sidebar event listeners
sidebarFontSelector.addEventListener('change', () => {
  if (currentTextBox) currentTextBox.style.fontFamily = sidebarFontSelector.value;
});
sidebarFontSize.addEventListener('change', () => {
  if (currentTextBox) currentTextBox.style.fontSize = sidebarFontSize.value + 'px';
});
sidebarFontWeight.addEventListener('change', () => {
  if (currentTextBox) currentTextBox.style.fontWeight = sidebarFontWeight.value;
});
sidebarRotateLeft.addEventListener('click', () => {
  if (currentTextBox) {
    let ang = (parseInt(currentTextBox.dataset.rotation || '0') - 90) % 360;
    currentTextBox.dataset.rotation = ang;
    currentTextBox.style.transform = `rotate(${ang}deg)`;
  }
});
sidebarRotateRight.addEventListener('click', () => {
  if (currentTextBox) {
    let ang = (parseInt(currentTextBox.dataset.rotation || '0') + 90) % 360;
    currentTextBox.dataset.rotation = ang;
    currentTextBox.style.transform = `rotate(${ang}deg)`;
  }
});

// Create a text box at specified coordinates
function createTextBoxAt(x, y) {
  // Show with focus and hide sidebar on blur
  textBox.addEventListener('focus', () => {
    textBox.style.border = '1px dashed #6366f1';
  });
  textBox.addEventListener('blur', () => {
    textBox.style.border = 'none';
    textSidebar.classList.remove('visible');
  });
  console.log('createTextBoxAt called at', x, y);
  const textBox = document.createElement('div');
  textBox.className = 'text-box';
  textBox.contentEditable = true;
  textBox.style.position = 'absolute';
  textBox.style.top = y + 'px';
  textBox.style.left = x + 'px';
  textBox.style.minWidth = '100px';
  textBox.style.minHeight = '30px';
  textBox.style.padding = '6px 10px';
  textBox.style.border = '1px dashed #6366f1';
  textBox.style.borderRadius = '8px';
  textBox.style.background = 'transparent';
  textBox.style.color = '#111827';
  textBox.style.fontSize = '16px';  bindTextBoxSidebar(textBox);
  container.appendChild(textBox);
  textBox.focus();
}

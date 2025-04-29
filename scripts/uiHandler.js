// scripts/uiHandler.js

function createTextBox() {
  const textBox = document.createElement('div');
  textBox.className = 'text-box';
  textBox.contentEditable = true;
  textBox.style.position = 'absolute';
  textBox.style.top = '100px';
  textBox.style.left = '100px';
  textBox.style.minWidth = '100px';
  textBox.style.minHeight = '30px';
  textBox.style.padding = '6px 10px';
  textBox.style.border = '1px dashed #6366f1';
  textBox.style.borderRadius = '8px';
  textBox.style.background = 'transparent';
  textBox.style.color = '#111827';
  textBox.style.fontSize = '16px';
  textBox.style.cursor = 'move';
  textBox.draggable = true;

  document.getElementById('pdf-container').appendChild(textBox);

  textBox.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', '');
  });

  textBox.addEventListener('dragend', (e) => {
    textBox.style.left = `${e.pageX - 50}px`;
    textBox.style.top = `${e.pageY - 15}px`;
  });

  textBox.addEventListener('focusout', () => {
    textBox.style.border = 'none';
  });

  textBox.addEventListener('focus', () => {
    textBox.style.border = '1px dashed #6366f1';
  });
}

function undo() {
  alert('Undo not implemented yet.');
}

function redo() {
  alert('Redo not implemented yet.');
}

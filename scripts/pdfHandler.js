// scripts/pdfHandler.js

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

let pdfDoc = null;
let scale = 1.0;
const container = document.getElementById('pdf-container');
const pageCanvases = [];

const pdfData = sessionStorage.getItem('pdfData');
const pdfName = sessionStorage.getItem('pdfName') || 'document.pdf';

if (pdfData) {
  loadPDF();
}

function loadPDF() {
  const loadingTask = pdfjsLib.getDocument({ data: atob(pdfData.split(',')[1]) });
  loadingTask.promise.then(function (pdf) {
    pdfDoc = pdf;
    renderAllPages();
  }).catch(err => {
    console.error('Error loading PDF:', err);
    alert('Failed to load PDF. Please try again.');
  });
}

function renderAllPages() {
  container.innerHTML = '';
  pageCanvases.length = 0;
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    pdfDoc.getPage(pageNum).then(function (page) {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.display = 'block';
      canvas.style.margin = '20px auto';
      container.appendChild(canvas);
      pageCanvases.push(canvas);
      page.render({ canvasContext: ctx, viewport: viewport });
    });
  }
}

function savePDF() {
  const originalTransform = container.style.transform;
  // Temporarily reset zoom for capture
  container.style.transform = '';
  html2canvas(container, { scale: 1 }).then(canvasMerged => {
    // Restore zoom
    container.style.transform = originalTransform;
    const imgData = canvasMerged.toDataURL('image/jpeg', 0.7);
    const pdf = new jspdf.jsPDF({ unit: 'px', format: 'a4', compressPdf: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvasMerged.width;
    const canvasHeight = canvasMerged.height;
    const ratio = canvasWidth / pageWidth;
    const pageCanvasHeight = pageHeight * ratio;
    let position = 0;
    while (position < canvasHeight) {
      pdf.addImage(imgData, 'JPEG', 0, -position / ratio, pageWidth, canvasHeight / ratio);
      position += pageCanvasHeight;
      if (position < canvasHeight) {
        pdf.addPage();
      }
    }
    pdf.save(pdfName);
  }).catch(err => {
    // Restore zoom on error
    container.style.transform = originalTransform;
    console.error('Error saving PDF:', err);
    alert('Failed to save PDF. Please try again.');
  });
}

function zoomIn() {
  scale += 0.2;
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = 'center center';
}

function zoomOut() {
  if (scale > 1) {
    scale -= 0.2;
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'center center';
  }
}

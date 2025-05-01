// scripts/pdfHandler.js

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
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

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.display = 'block';
      canvas.style.margin = '20px auto';

      container.appendChild(canvas);
      pageCanvases.push(canvas);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }
}

function savePDF() {
  const pdf = new jspdf.jsPDF('p', 'px', 'a4');
  
  pageCanvases.forEach((canvas, index) => {
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const canvasAspect = canvas.width / canvas.height;
    const pageAspect = pageWidth / pageHeight;

    let renderWidth, renderHeight;

    if (canvasAspect > pageAspect) {
      renderWidth = pageWidth;
      renderHeight = pageWidth / canvasAspect;
    } else {
      renderHeight = pageHeight;
      renderWidth = pageHeight * canvasAspect;
    }

    pdf.addImage(imgData, 'JPEG', (pageWidth - renderWidth) / 2, (pageHeight - renderHeight) / 2, renderWidth, renderHeight);

    if (index < pageCanvases.length - 1) {
      pdf.addPage();
    }
  });

  pdf.save(pdfName);
}

function zoomIn() {
  scale += 0.2;
  renderAllPages();
}

function zoomOut() {
  if (scale > 0.4) {
    scale -= 0.2;
    renderAllPages();
  }
}

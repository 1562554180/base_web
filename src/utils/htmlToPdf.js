
async function drawPdf(option = { width: 210, height: 297 }, dom, pdf, bg) { 
  const JsPDF = window.jsPDF || {};
  const html2Canvas = window.html2canvas || {};
  const element = dom || document.getElementById("pdfDom");
  window.scrollTo(0, 0);
  const canvas = await html2Canvas(element, {
    dpu: 172, // 导出pdf的清晰度
    useCORS: true,
    allowTaint: false,
    taintTest: true,
    scale: 1,
    background: bg || '#FFFFFF',
  });
  
  const contentWidth = canvas.width; // 实际的宽高
  const contentHeight = canvas.height;
  const pdfWidth = option.width; // pdf设置的宽高
  const pdfHeight = (contentHeight / contentWidth) * pdfWidth;
  let leftHeight = contentHeight;
  let position = 0;

  const pageData = canvas.toDataURL("image/jpeg", 1.0);
  pdf = pdf || new JsPDF({
    orientation: option.orientation || "p", 
    unit: "pt", 
    format: [contentWidth, contentHeight]
  });
  if (leftHeight < pdfHeight) {
    pdf.addImage(pageData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  } else {
    while (leftHeight > 0) {
      pdf.addImage(pageData, "JPEG", 0, position, pdfWidth, (contentHeight / contentWidth) * pdfWidth);
      leftHeight -= pdfHeight;
      position -= pdfHeight;
      if (leftHeight > 0) {
        pdf.addPage();
      }
    }
  }

  return pdf;
}

function handlePrint(url) {
  const printWindow = window.open(url);
  printWindow.onload = function() {
    const style = `
      @media print {
        @page {
          size: auto;
          margin: 0;
        }
        body {
          transform: scale(1);
          transform-origin: top left;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        img {
          width: 100%;
          height: auto;
        }
      }
    `;
    const styleSheet = printWindow.document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = style;
    printWindow.document.head.appendChild(styleSheet);
    printWindow.print();
    printWindow.onafterprint = function() {
      printWindow.close();
      URL.revokeObjectURL(url); // 清理资源
    };
  };
}

const htmlToPdf = {
  async exportPdf(option, dom, name, bg) {
    try {
      let pdf = null;
      if (dom instanceof Array) {
        for (let index = 0; index < dom.length; index++) {
          pdf = await drawPdf(option, dom[index], pdf, bg);
          if (index < dom.length-1) {
            pdf.addPage();
          }
        }
      } else {
        pdf = await drawPdf(option, dom, pdf, bg)
      }
      pdf.save(`${name}.pdf`);
    } catch (error) {
      console.error("导出PDF失败", error);
    }
  },

  async printPdf(option, dom) {
    try {
      let pdf = null;
      if (dom instanceof Array) {
        for (let index = 0; index < dom.length; index++) {
          pdf = await drawPdf(option, dom[index], pdf);
          if (index < dom.length-1) {
            pdf.addPage();
          }
        }
      } else {
        pdf = await drawPdf(option, dom)
      }
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      handlePrint(url);
    } catch (error) {
      console.error("打印PDF失败", error);
    }
  },
};

export default htmlToPdf;
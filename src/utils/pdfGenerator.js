import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import logo from '../assets/Logo.png';  

const getBase64Image = (imgUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (error) => reject(error);
    img.src = imgUrl;
  });
};

// NOTICE: We added 'onProgress' as the second parameter
export const generateLabelsPDF = async (labelNumbers, onProgress) => {
  const logoBase64 = await getBase64Image(logo);

  const doc = new jsPDF({
    orientation: "landscape", 
    unit: "mm",
    format: [100, 25] 
  });

  const qrsPerPage = 4;      
  const startX = 2;          
  const stickerWidth = 22.5; 
  const gapX = 1.5;          
  const qrSize = 14; 
  const qrOffset = (stickerWidth - qrSize) / 2; 

  for (let i = 0; i < labelNumbers.length; i++) {
    const label = labelNumbers[i];
    const verifyUrl = `${import.meta.env.VITE_FRONTEND_URL}/verify/${label}`;

    if (i > 0 && i % qrsPerPage === 0) {
      doc.addPage([100, 25], "landscape");
    }

    const col = i % qrsPerPage;
    const currentX = startX + (col * (stickerWidth + gapX));
    const currentY = 0;

    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        width: 120,  
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H' 
      });

      doc.addImage(qrDataUrl, "PNG", currentX + qrOffset, currentY + 3.0, qrSize, qrSize);

      const logoSize = 3.5; 
      const logoX = currentX + qrOffset + (qrSize / 2) - (logoSize / 2);
      const logoY = currentY + 3.0 + (qrSize / 2) - (logoSize / 2);

      doc.setFillColor(255, 255, 255);
      doc.rect(logoX - 0.2, logoY - 0.2, logoSize + 0.4, logoSize + 0.4, 'F');
      doc.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize, 'SVSLogo', 'FAST');

      doc.setFontSize(5.5);
      doc.text(label, currentX + (stickerWidth / 2), currentY + 22.0, { align: "center" });

      // UPDATE THE PROGRESS BAR EVERY 50 LABELS
      if (i % 50 === 0) {
        if (onProgress) onProgress(i, labelNumbers.length);
        await new Promise(resolve => setTimeout(resolve, 1));
      }

    } catch (err) {
      console.error("Error generating QR:", label, err);
    }
  }
  
  // Force progress bar to 100% at the very end
  if (onProgress) onProgress(labelNumbers.length, labelNumbers.length);

  try {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = "Thermal_100x25_Labels.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to force download:", error);
    alert("The PDF was generated, but your browser blocked the massive download.");
  }
};
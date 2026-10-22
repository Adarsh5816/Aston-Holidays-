/**
 * Aston Holidays Isolated Document Printer & High-Fidelity PDF Engine
 * Supports:
 * 1. Direct PDF Download on Mobile (iOS / Android / PWA) via jsPDF + html2canvas
 * 2. Native Web Share API integration (Save to Files / Share to WhatsApp)
 * 3. Isolated sandbox printing for desktop browsers without background bleed
 */

export async function downloadElementAsPdf(
  elementId: string,
  filename: string = "Aston-Holidays-Document.pdf"
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`[downloadElementAsPdf] Element with ID "${elementId}" not found.`);
    return false;
  }

  try {
    // Dynamic client-only import to ensure SSR compatibility
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf")
    ]);

    // Ensure all images are loaded
    const images = Array.from(element.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    );

    // Render element to high-res canvas (2x scale for crisp retina vector-like text)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1024, // Renders in standard desktop proportions
      onclone: (clonedDoc: Document) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.overflow = "visible";
          clonedEl.style.height = "auto";
          clonedEl.style.maxHeight = "none";
          let parent = clonedEl.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.overflow = "visible";
            parent.style.maxHeight = "none";
            parent.style.height = "auto";
            parent = parent.parentElement;
          }
        }
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    const pdfBlob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Try native Mobile Web Share API first (iOS Safari / Android Chrome)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        const file = new File([pdfBlob], cleanFilename, { type: "application/pdf" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: cleanFilename,
            text: "Aston Holidays Official Voucher & Bill",
          });
          return true;
        }
      } catch (shareErr: any) {
        if (shareErr?.name === "AbortError") {
          return true;
        }
        console.warn("[downloadElementAsPdf] Native share dismissed or unsupported, falling back to direct download", shareErr);
      }
    }

    // Direct browser file download / anchor click fallback
    try {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = cleanFilename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(blobUrl);
      }, 5000);
      return true;
    } catch (saveErr) {
      console.warn("[downloadElementAsPdf] Link click fallback failed, using pdf.save:", saveErr);
      pdf.save(cleanFilename);
      return true;
    }
  } catch (err) {
    console.error("[downloadElementAsPdf] Failed to generate PDF:", err);
    return false;
  }
}

export async function printElementIsolated(elementId: string, documentTitle?: string): Promise<void> {
  if (typeof window === "undefined") return;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // On Mobile (iOS Safari / Android PWA), iframe printing is blocked or non-functional.
  // Seamlessly route to high-fidelity PDF download / Mobile Share!
  if (isMobile) {
    const filename = `${documentTitle ? documentTitle.replace(/[^a-zA-Z0-9-_]/g, "-") : "Aston-Document"}.pdf`;
    await downloadElementAsPdf(elementId, filename);
    return;
  }

  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    window.print();
    return;
  }

  // Remove any pre-existing print iframe
  const existingFrame = document.getElementById("aston-isolated-print-frame");
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create an invisible iframe for desktop browser printing
  const iframe = document.createElement("iframe");
  iframe.id = "aston-isolated-print-frame";
  iframe.setAttribute("style", "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:0;visibility:hidden;");
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  const styleNodes = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
  const stylesHtml = styleNodes.map(node => node.outerHTML).join("\n");
  const title = documentTitle || "Aston Holidays Official Document";

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <base href="${window.location.origin}/" />
        <title>${title}</title>
        ${stylesHtml}
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background: #FFFFFF !important;
            background-color: #FFFFFF !important;
            color: #1A2218 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          .no-print, .print\\:hidden {
            display: none !important;
          }
          #isolated-print-root {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
          }
          tr, .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          img {
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        <div id="isolated-print-root">
          ${targetElement.innerHTML}
        </div>
      </body>
    </html>
  `);
  iframeDoc.close();

  const runPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("[printElementIsolated] Desktop iframe print fallback:", e);
      window.print();
    } finally {
      setTimeout(() => {
        const frame = document.getElementById("aston-isolated-print-frame");
        if (frame) frame.remove();
      }, 60000);
    }
  };

  const images = Array.from(iframeDoc.images || []);
  if (images.length === 0) {
    setTimeout(runPrint, 250);
  } else {
    let pending = images.length;
    const onImgComplete = () => {
      pending--;
      if (pending <= 0) setTimeout(runPrint, 250);
    };

    images.forEach(img => {
      if (img.complete) {
        pending--;
      } else {
        img.onload = onImgComplete;
        img.onerror = onImgComplete;
      }
    });

    if (pending <= 0) {
      setTimeout(runPrint, 250);
    } else {
      setTimeout(runPrint, 1500);
    }
  }
}

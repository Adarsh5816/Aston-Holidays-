/**
 * Aston Holidays Isolated Document Printer
 * Creates a standalone, isolated printing context (iframe) to guarantee
 * that dashboard sidebars, navigation bars, and background sheets NEVER
 * bleed into customer-facing invoices, vouchers, and bills.
 */

export function printElementIsolated(elementId: string, documentTitle?: string): void {
  if (typeof window === "undefined") return;

  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    console.warn(`[printElementIsolated] Element with ID "${elementId}" not found. Falling back to window.print()`);
    window.print();
    return;
  }

  // Remove any pre-existing print iframe
  const existingFrame = document.getElementById("aston-isolated-print-frame");
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create an invisible iframe
  const iframe = document.createElement("iframe");
  iframe.id = "aston-isolated-print-frame";
  iframe.setAttribute("style", "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:0;visibility:hidden;");
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  // Extract all existing CSS link tags and style tags from the current document
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

  // Function to execute print once images and styling are fully parsed
  const runPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("[printElementIsolated] Print execution failed, falling back to window.print()", e);
      window.print();
    } finally {
      // Clean up after 1 minute so the iframe doesn't linger indefinitely
      setTimeout(() => {
        const frame = document.getElementById("aston-isolated-print-frame");
        if (frame) frame.remove();
      }, 60000);
    }
  };

  // Ensure all images within the iframe have completed loading before printing
  const images = Array.from(iframeDoc.images || []);
  if (images.length === 0) {
    setTimeout(runPrint, 250);
  } else {
    let pending = images.length;
    const onImgComplete = () => {
      pending--;
      if (pending <= 0) {
        setTimeout(runPrint, 250);
      }
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
      // Fallback timeout in case an image hangs
      setTimeout(runPrint, 1500);
    }
  }
}

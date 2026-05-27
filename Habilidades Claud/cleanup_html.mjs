import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// Remove duplicate PDF button for Bar (keep first occurrence)
// Pattern: two consecutive PDF buttons
html = html.replace(
  /(<button id="btnImportPDF_bar"[^>]*>📄 PDF 25\/03–25\/05<\/button>\s*\n\s*)<button id="btnImportPDF_bar"[^>]*>📄 PDF 25\/03–25\/05<\/button>/g,
  '$1'
);

// Remove duplicate PDF button for Holding
html = html.replace(
  /(<button id="btnImportPDF_holding"[^>]*>📄 PDF 25\/03–25\/05<\/button>\s*\n\s*)<button id="btnImportPDF_holding"[^>]*>📄 PDF 25\/03–25\/05<\/button>/g,
  '$1'
);

// Find position of second "// ─── IMPORTAR EXTRATOS PDF" and remove from there to the closing }
const marker = '// ─── IMPORTAR EXTRATOS PDF (25/03-25/05/2026)';
const firstPos = html.indexOf(marker);
const secondPos = html.indexOf(marker, firstPos + 1);

if (secondPos > 0) {
  // Find the closing "}\n</script>" after the second marker
  const closingScript = html.indexOf('\n</script>', secondPos);
  if (closingScript > 0) {
    // Remove everything from secondPos to just before \n</script>
    const toRemove = html.slice(secondPos, closingScript);
    console.log('Removing duplicate block of', toRemove.length, 'chars');
    html = html.slice(0, secondPos) + html.slice(closingScript);
  }
}

// Verify
const markerCount = (html.match(/IMPORTAR EXTRATOS PDF/g)||[]).length;
const barBtnCount = (html.match(/btnImportPDF_bar/g)||[]).length;
const holdBtnCount = (html.match(/btnImportPDF_holding/g)||[]).length;
const fnCount = (html.match(/function importarExtratosPDF/g)||[]).length;

console.log('Marker occurrences:', markerCount);
console.log('Bar btn occurrences:', barBtnCount);
console.log('Hold btn occurrences:', holdBtnCount);
console.log('Function occurrences:', fnCount);
console.log('HTML size:', html.length, 'bytes');

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Saved.');

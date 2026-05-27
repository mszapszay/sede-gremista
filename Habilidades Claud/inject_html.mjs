import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');
const fn = readFileSync('C:/Users/mauri/Downloads/import_fn.js', 'utf8');

// 1. Add import buttons to Bar tab (after "Importar XLSX" button)
html = html.replace(
  '<button class="btn btn-primary btn-sm admin-only" onclick="document.getElementById(\'fileBarXlsx\').click()">📥 Importar XLSX</button>',
  '<button class="btn btn-primary btn-sm admin-only" onclick="document.getElementById(\'fileBarXlsx\').click()">📥 Importar XLSX</button>\n      <button id="btnImportPDF_bar" class="btn btn-sm admin-only" style="background:#7c3aed;color:#fff" onclick="importarExtratosPDF(\'bar\')">📄 PDF 25/03–25/05</button>'
);

// 2. Add import button to Holding tab
html = html.replace(
  '<button class="btn btn-primary btn-sm admin-only" onclick="document.getElementById(\'fileHoldingXlsx\').click()">📥 Importar XLSX</button>',
  '<button class="btn btn-primary btn-sm admin-only" onclick="document.getElementById(\'fileHoldingXlsx\').click()">📥 Importar XLSX</button>\n      <button id="btnImportPDF_holding" class="btn btn-sm admin-only" style="background:#7c3aed;color:#fff" onclick="importarExtratosPDF(\'holding\')">📄 PDF 25/03–25/05</button>'
);

// 3. Inject the import function before </script>
html = html.replace('</script>', fn + '\n</script>');

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Done. HTML size:', html.length, 'bytes');

// Verify buttons were added
const btnBar = html.includes('btnImportPDF_bar');
const btnHold = html.includes('btnImportPDF_holding');
const fnAdded = html.includes('PDF_BAR=');
console.log('Bar button added:', btnBar);
console.log('Holding button added:', btnHold);
console.log('Function added:', fnAdded);

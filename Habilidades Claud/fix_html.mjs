import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');
const fn = readFileSync('C:/Users/mauri/Downloads/import_fn.js', 'utf8');

// Step 1: Remove the misplaced injection from inside the CDN script tag
// The block is between <script src="xlsx..."> and first </script>
// It looks like:  \n// ─── IMPORTAR EXTRATOS PDF...\nconst PDF_BAR=...;\n...\n}\n\n\n
const wrongBlock = html.match(/(<script src="https:\/\/cdnjs[^>]*>)([\s\S]*?)(<\/script>)/);
if (wrongBlock) {
  const innerContent = wrongBlock[2];
  const hasInjection = innerContent.includes('PDF_BAR');
  console.log('Found CDN script block, has injection:', hasInjection);
  if (hasInjection) {
    // Replace with empty tag (no inner content)
    html = html.replace(wrongBlock[0], wrongBlock[1] + wrongBlock[3]);
    console.log('Removed misplaced injection from CDN script tag');
  }
}

// Step 2: Inject at the LAST </script> (the main app script)
const lastScriptClose = html.lastIndexOf('</script>');
if (lastScriptClose < 0) throw new Error('No </script> found!');

html = html.slice(0, lastScriptClose) + fn + '\n</script>' + html.slice(lastScriptClose + '</script>'.length);

// Verify
const lines = html.split('\n');
const scriptTags = [...html.matchAll(/<script(\s[^>]*)?>|<\/script>/g)];
scriptTags.forEach(m => {
  const lineNum = html.slice(0, m.index).split('\n').length;
  console.log('Line', lineNum, ':', m[0].slice(0, 80));
});

const fnLine = lines.findIndex(l => l.includes('function importarExtratosPDF'));
const barBtnLine = lines.findIndex(l => l.includes('btnImportPDF_bar'));
console.log('\nFunction at line:', fnLine + 1);
console.log('Bar button at line:', barBtnLine + 1);
console.log('Total HTML size:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Saved.');

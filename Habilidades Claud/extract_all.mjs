import { readFileSync, writeFileSync } from 'fs';
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

async function extractAllPages(filePath) {
  const data = new Uint8Array(readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true}).promise;
  console.error(`Pages: ${pdf.numPages}`);
  let pages = [];
  for(let i=1; i<=pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let text = '';
    for(const item of content.items) {
      text += item.str;
      if(item.hasEOL) text += '\n';
      else if(item.str.trim()) text += '   ';
    }
    pages.push(text);
  }
  return pages;
}

const barPages = await extractAllPages('C:/Users/mauri/Downloads/25.03.2026 a 25.05.2026 - Extrato Bar.pdf');
writeFileSync('C:/Users/mauri/Downloads/bar_text.txt', barPages.join('\n===PAGE_BREAK===\n'));
console.error('Bar done');

const holdPages = await extractAllPages('C:/Users/mauri/Downloads/25.03.2026 a 25.05.2026 - Extrato Holding.pdf');
writeFileSync('C:/Users/mauri/Downloads/holding_text.txt', holdPages.join('\n===PAGE_BREAK===\n'));
console.error('Holding done - pages:', holdPages.length);

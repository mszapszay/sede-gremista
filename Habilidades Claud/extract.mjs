import { readFileSync } from 'fs';

const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

async function extractText(filePath) {
  const data = new Uint8Array(readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true}).promise;
  console.log(`Pages: ${pdf.numPages}`);
  let allText = '';
  for(let i=1; i<=Math.min(3, pdf.numPages); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = content.items;
    let text = '';
    for(const item of items) {
      text += item.str;
      if(item.hasEOL) text += '\n';
      else text += ' ';
    }
    allText += `--- PAGE ${i} ---\n${text}\n`;
  }
  return allText;
}

const t = await extractText('C:/Users/mauri/Downloads/25.03.2026 a 25.05.2026 - Extrato Bar.pdf');
console.log(t);

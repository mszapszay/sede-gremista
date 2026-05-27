import { readFileSync, writeFileSync } from 'fs';

// ======== BAR PDF PARSER ========
function parseBarText(fullText) {
  const transactions = [];
  const pages = fullText.split('===PAGE_BREAK===');

  const MONTH_MAP = {
    'Jan':1,'Fev':2,'Mar':3,'Abr':4,'Mai':5,'Jun':6,
    'Jul':7,'Ago':8,'Set':9,'Out':10,'Nov':11,'Dez':12
  };

  for(const page of pages) {
    // Find dates at END of page (they always appear after all transaction blocks)
    // Look for the last cluster of "DD Mmm, YYYY" lines
    // Strategy: find all date matches, take only the ones near the end of the page
    const allDateMatches = [...page.matchAll(/\b(\d{1,2})\s+(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez),\s+(\d{4})\b/g)];
    // The footer dates appear at the end; header range date appears near pos 0
    // Keep only dates that appear after the "Saldo do dia" lines (in the footer cluster)
    // Simple heuristic: exclude dates in the first 300 chars (header area)
    const dateMatches = allDateMatches.filter(m => m.index > 300);

    // Split by day-group headers
    const allParts = page.split(/Data\s+Hora\s+Tipo de transação\s+Nome\s+Detalhe\s+Valor \(R\$\)[^\n]*/);

    // Include ALL parts that have actual transaction lines (HH:MM format)
    const groups = allParts.filter(p => /\b\d{2}:\d{2}\b/.test(p));

    if(groups.length !== dateMatches.length) {
      process.stderr.write(`Warning: ${groups.length} groups vs ${dateMatches.length} dates\n`);
    }

    for(let i=0; i<groups.length; i++) {
      const dateMatch = dateMatches[i];
      if(!dateMatch) continue;

      const day = dateMatch[1].padStart(2,'0');
      const month = String(MONTH_MAP[dateMatch[2]]).padStart(2,'0');
      const year = dateMatch[3];
      const dateStr = `${year}-${month}-${day}`;

      const group = groups[i];
      // Take transactions before "Saldo do dia" if present, otherwise whole group
      const content = group.includes('Saldo do dia') ? group.split('Saldo do dia')[0] : group;

      // Each transaction row - split by newlines, joining continuation lines
      const rawLines = content.split('\n').map(r=>r.trim()).filter(r=>r);
      const txRows = [];
      for(let li=0; li<rawLines.length; li++) {
        const line = rawLines[li];
        if(/^\d{2}:\d{2}/.test(line)) {
          // Check if value is at the end; if not, next line might be continuation
          let combined = line;
          while(!combined.match(/[+-][\d.,]+$/) && li+1 < rawLines.length && !/^\d{2}:\d{2}/.test(rawLines[li+1]) && !rawLines[li+1].match(/^Saldo do dia/)) {
            li++;
            combined = combined + ' ' + rawLines[li].trim();
          }
          txRows.push(combined);
        }
      }

      for(const row of txRows) {
        // Split on 3+ spaces to get fields: hora, tipo, nome(with Pix prefix), detalhe, valor
        const fields = row.split(/\s{3,}/);
        if(fields.length < 3) continue;

        const hora = fields[0];
        if(!hora.match(/^\d{2}:\d{2}$/)) continue;

        const valorStr = fields[fields.length - 1];
        if(!valorStr.match(/^[+-][\d.,]+$/)) continue;

        const valor = parseFloat(valorStr.replace(/\./g,'').replace(',','.'));

        let tipo, nome, detalhe;
        if(fields.length >= 5) {
          tipo = fields[1];
          nome = fields[2].replace(/^Pix\s+/i,'');
          detalhe = fields[3];
        } else if(fields.length === 4) {
          tipo = fields[1];
          nome = fields[2].replace(/^Pix\s+/i,'');
          detalhe = '';
        } else {
          tipo = 'Pix';
          nome = fields[1].replace(/^Pix\s+/i,'');
          detalhe = '';
        }

        transactions.push({
          data: dateStr, hora, tipo: tipo.trim(), nome: nome.trim(), detalhe: detalhe.trim(),
          valor, dir: valor>=0 ? 'entrada' : 'saida'
        });
      }
    }
  }

  return transactions;
}

// ======== HOLDING PDF PARSER ========
function parseHoldingText(fullText) {
  const transactions = [];
  const cleaned = fullText
    .replace(/===PAGE_BREAK===/g, '\n')
    .replace(/PicPay Servi[^\n]*/g, '')
    .replace(/nossa Ouvidoria[^\n]*/g, '')
    .replace(/Se voc[^\n]*/g, '')
    .replace(/\d+ de \d+/g, '');

  const lines = cleaned.split('\n').map(l=>l.trim()).filter(l=>l);

  let startIdx = 0;
  for(let i=0; i<lines.length; i++) {
    if(lines[i].match(/^Data\s+Movimenta/)) {
      startIdx = i + 1;
      break;
    }
  }

  let i = startIdx;
  while(i < lines.length) {
    const line = lines[i];

    const dateM = line.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(.*)/);
    if(!dateM) { i++; continue; }

    const dateStr = `${dateM[3]}-${dateM[2]}-${dateM[1]}`;
    const rest = dateM[4].trim();

    // Balance line: "R$ X,XX" with no other text
    if(rest.match(/^-?R\$\s*[\d.,]+$/) || rest === '') { i++; continue; }

    // Transaction: tipo is on this line
    const tipo = rest;
    i++;
    if(i >= lines.length) break;

    // Next line is name (doesn't start with Entrada/Saida)
    if(lines[i].match(/^(Entrada|Sa[íi]da)\s/)) { i++; continue; }
    const nome = lines[i];
    i++;
    if(i >= lines.length) break;

    const dirValLine = lines[i];
    const dvM = dirValLine.match(/^(Entrada|Sa[íi]da)\s+(-?R\$\s*[\d.,]+)/);
    if(!dvM) { continue; }
    i++;

    const dirRaw = dvM[1];
    const valorStr = dvM[2].replace(/-?R\$\s*/,'').trim();
    const valor = parseFloat(valorStr.replace(/\./g,'').replace(',','.'));
    const dir = dirRaw === 'Entrada' ? 'entrada' : 'saida';

    transactions.push({ data: dateStr, tipo, nome, valor: Math.abs(valor), dir });
  }

  return transactions;
}

// ======== CATEGORIZATION ========
function categorizarBar(t) {
  const n = t.nome.toLowerCase();
  const tp = (t.tipo||'').toLowerCase();
  const det = (t.detalhe||'').toLowerCase();

  if(tp.includes('dep') || det.includes('infinitepay')) return 'receita_bar';
  if(t.dir==='entrada' && n.match(/szapszay|mauricio.*pinto/)) return 'aporte';
  if(t.dir==='entrada') return 'pix_recebido';
  if(n.match(/dalmir.*peres|eduardo.*portella/)) return 'bebidas';
  if(n.match(/distribuidora.*lulu/)) return 'bebidas';
  if(n.match(/ceee|companhia estadual/)) return 'luz';
  if(n.match(/dmae/)) return 'agua';
  if(n.match(/disknet/)) return 'internet';
  if(n.match(/ministerio.*fazenda|simples.*nacional/)) return 'impostos';
  if(n.match(/mariana.*(peres|rocha)/)) return 'faxina';
  return 'outros';
}

function categorizarHolding(t) {
  const n = t.nome.toLowerCase();
  const tp = (t.tipo||'').toLowerCase();

  if(t.dir==='entrada') {
    if(n.match(/szapszay|mauricio.*pinto/)) return 'aporte_casa';
    if(n.match(/ariel.*ribeiro|60\.982\.530/)) return 'outros_rec';
    return 'mensalidade';
  }
  if(n.match(/tintas|lemare|tinta|pintura/)) return 'reforma';
  if(n.match(/ferragem|dusesi|material/)) return 'manutencao';
  if(n.match(/patricia.*silva|patrique|solange|valdir|douglas.*vagner/)) return 'manutencao';
  if(tp.includes('dinheiro guardado') || n.match(/cofrinho|wise.*brasil/)) return 'outros';
  if(n.match(/manica|claudia.*coitinho|conter/)) return 'manutencao';
  return 'outros';
}

// ======== READ & PARSE ========
const barText = readFileSync('C:/Users/mauri/Downloads/bar_text.txt', 'utf8');
const holdText = readFileSync('C:/Users/mauri/Downloads/holding_text.txt', 'utf8');

const barTxs = parseBarText(barText);
const holdTxs = parseHoldingText(holdText);

// uid generator (same as app)
let _uid = 0;
function uid(){ return 'p'+(Date.now().toString(36)+Math.random().toString(36).slice(2)).slice(0,12)+(++_uid); }

const barFinal = barTxs.map((t,i) => {
  const cat = categorizarBar(t);
  const catDesc = {
    receita_bar:'Vendas no bar (maquininha)', pix_recebido: t.nome,
    aporte:'Aporte – '+t.nome, bebidas:'Bebidas – '+t.nome,
    luz:'Energia Elétrica – CEEE', agua:'Água – DMAE',
    internet:'Internet – DISKNET', impostos:'Impostos – '+t.nome,
    faxina:'Faxina – Mariana', outros: t.nome
  }[cat] || t.nome;
  return {
    id: uid(),
    data: t.data,
    hora: t.hora || '00:00',
    tipo: t.tipo || 'Pix',
    nome: t.nome,
    detalhe: t.detalhe || '',
    valor: Math.abs(t.valor),
    dir: t.dir,
    cat: cat,
    desc: catDesc,
    key: `pdf_bar|${t.data}|${t.hora||'00:00'}|${Math.abs(t.valor).toFixed(2)}|${t.nome}`
  };
});

const holdFinal = holdTxs.map((t,i) => {
  const cat = categorizarHolding(t);
  const tipoStr = t.dir==='entrada' ? 'Entrada' : 'Saída';
  const catDesc = {
    mensalidade:'Mensalidade – '+t.nome, aporte_reforma:'Aporte Reforma – '+t.nome,
    aporte_casa:'Compra Casa – '+t.nome, outros_rec: t.nome,
    manutencao:'Manutenção – '+t.nome, reforma:'Reforma – '+t.nome, outros: t.nome
  }[cat] || t.nome;
  return {
    id: uid(),
    data: t.data,
    mov: t.tipo,        // "Pix recebido" / "Pix enviado"
    desc: t.nome,       // person/company name
    obs: '',
    tipo: tipoStr,      // "Entrada" / "Saída"
    valor: t.valor,
    dir: t.dir,
    cat: cat,
    catDesc: catDesc,
    membroId: null,
    key: `pdf_hold|${t.data}|${t.valor.toFixed(2)}|${t.nome}`
  };
});

writeFileSync('C:/Users/mauri/Downloads/bar_transactions.json', JSON.stringify(barFinal, null, 2));
writeFileSync('C:/Users/mauri/Downloads/hold_transactions.json', JSON.stringify(holdFinal, null, 2));

console.log(`Bar: ${barFinal.length} transactions`);
console.log(`Holding: ${holdFinal.length} transactions`);

const barIn = barFinal.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
const barOut = barFinal.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
console.log(`Bar entradas: R$ ${barIn.toFixed(2)}, saidas: R$ ${barOut.toFixed(2)}`);

const holdIn = holdFinal.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
const holdOut = holdFinal.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
console.log(`Holding entradas: R$ ${holdIn.toFixed(2)}, saidas: R$ ${holdOut.toFixed(2)}`);

console.log('\nBar samples:');
barFinal.slice(0,5).forEach(t=>console.log(JSON.stringify(t)));
console.log('\nHolding samples:');
holdFinal.slice(0,5).forEach(t=>console.log(JSON.stringify(t)));

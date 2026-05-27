import { readFileSync, writeFileSync } from 'fs';

const bar = JSON.parse(readFileSync('C:/Users/mauri/Downloads/bar_compact.json', 'utf8'));
const hold = JSON.parse(readFileSync('C:/Users/mauri/Downloads/hold_compact.json', 'utf8'));

const barJson = JSON.stringify(bar);
const holdJson = JSON.stringify(hold);

const fn = `
// ─── IMPORTAR EXTRATOS PDF (25/03-25/05/2026) ───
const PDF_BAR=${barJson};
const PDF_HOLDING=${holdJson};

function importarExtratosPDF(tipo){
  if(!IS_ADMIN)return;
  if(!(DB.importKeys instanceof Set))DB.importKeys=new Set(DB.importKeys||[]);
  const data=tipo==='bar'?PDF_BAR:PDF_HOLDING;
  let novos=0,dups=0;
  data.forEach(t=>{
    if(DB.importKeys.has(t.key)){dups++;return;}
    DB.importKeys.add(t.key);
    novos++;
    if(tipo==='bar'){
      DB.extratoBar.push({id:t.id,data:t.data,hora:t.hora,tipo:t.tipo,nome:t.nome,detalhe:t.detalhe,valor:t.valor,dir:t.dir,cat:t.cat,desc:t.desc});
    }else{
      DB.extratoHolding.push({id:t.id,data:t.data,mov:t.mov,desc:t.desc,obs:t.obs,tipo:t.tipo,valor:t.valor,dir:t.dir,cat:t.cat});
      if(t.cat==='mensalidade'&&t.membroId){const mes=getMes(t.data);if(mes){if(!DB.mensalidades[t.membroId])DB.mensalidades[t.membroId]={};if(!DB.mensalidades[t.membroId][mes])DB.mensalidades[t.membroId][mes]='pago';}}
    }
  });
  if(tipo==='bar'&&!DB.saldoAberturaBar)DB.saldoAberturaBar=1567.34;
  salvarDB();
  if(tipo==='bar')renderContaBar();else renderContaHolding();
  atualizarHeader();
  const btn=document.getElementById('btnImportPDF_'+tipo);
  if(btn){btn.textContent='\\u2713 Importado';btn.disabled=true;btn.style.background='#9ca3af';}
  const msg=novos+' transac\\u00e3o(\\u00f5es) importada(s) de PDF.'+(dups?' '+dups+' duplicata(s) ignorada(s).':'');
  alert('\\u2713 '+msg);
}
`;

writeFileSync('C:/Users/mauri/Downloads/import_fn.js', fn, 'utf8');
console.log('Written, size:', fn.length, 'bytes');
console.log('Last 200 chars:', fn.slice(-200));

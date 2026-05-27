import { readFileSync, writeFileSync } from 'fs';

const FILE = 'C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html';

console.log('=== add_comanda_import.mjs ===');
console.log(`Reading: ${FILE}`);
let html = readFileSync(FILE, 'utf8');
const originalSize = html.length;
console.log(`File size: ${originalSize} bytes`);

let changed = false;

// ─── STEP 1: Update calcCmd ───
console.log('\n[1/4] Checking calcCmd update...');
const GUARD_1 = 'if(i.valor!=null&&i.desconto==null)return i.valor;';
if (html.includes(GUARD_1)) {
  console.log('  → Already applied. Skipping.');
} else {
  const OLD_CALC = `function calcCmd(i){
  const sub=(i.brahma||0)*15+(i.heineken||0)*18+(i.fernet||0)*20+(i.refrig||0)*6+(i.agua||0)*5;
  return sub*(1-Math.min(Math.max(i.desconto||0,0),100)/100);
}`;
  const NEW_CALC = `function calcCmd(i){
  if(i.valor!=null&&i.desconto==null)return i.valor;
  const sub=(i.brahma||0)*15+(i.heineken||0)*18+(i.fernet||0)*20+(i.refrig||0)*6+(i.agua||0)*5;
  return sub*(1-Math.min(Math.max(i.desconto||0,0),100)/100);
}`;
  if (!html.includes(OLD_CALC)) {
    console.error('ERROR: Could not find original calcCmd. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_CALC, NEW_CALC);
  console.log('  → Applied: calcCmd updated with i.valor support.');
  changed = true;
}

// ─── STEP 2: Update renderComandas table ───
console.log('\n[2/4] Checking renderComandas table update...');
const GUARD_2 = 'Sócio / Descrição';
if (html.includes(GUARD_2)) {
  console.log('  → Already applied. Skipping.');
} else {
  const OLD_TBL = `if(items.length)tbl=\`<table class="ctable"><thead><tr><th>Sócio</th><th>Brahma</th><th>Heineken</th><th>Fernet</th><th>Refrig.</th><th>Água</th><th>Desc.</th><th>Total</th><th>Status</th><th class="admin-only"></th></tr></thead><tbody>
      \${items.map((item,idx)=>{
        const mb=DB.membros.find(m=>m.id===item.membroId);
        return\`<tr>
          <td>\${mb?mb.nome:'?'}</td>
          <td>\${item.brahma||0}</td><td>\${item.heineken||0}</td><td>\${item.fernet||0}</td>
          <td>\${item.refrig||0}</td><td>\${item.agua||0}</td>
          <td>\${item.desconto?item.desconto+'%':'–'}</td>
          <td class="bold">\${brl(calcCmd(item))}</td>
          <td>\${item.status==='pago'?'<span class="badge bg-green">Pago</span>':'<span class="badge bg-red">Pendente</span>'}</td>
          <td class="admin-only" style="white-space:nowrap">
            \${item.status==='pendente'?\`<button class="btn btn-success btn-sm" onclick="marcarPago('\${j.id}',\${idx})">✓</button> \`:''}
            <button class="btn btn-danger btn-sm" onclick="removerComanda('\${j.id}',\${idx})">🗑️</button>
          </td>
        </tr>\`;
      }).join('')}</tbody></table>\`;`;

  const NEW_TBL = `if(items.length)tbl=\`<table class="ctable"><thead><tr><th>Sócio / Descrição</th><th>Detalhes</th><th>Total</th><th>Status</th><th class="admin-only"></th></tr></thead><tbody>
      \${items.map((item,idx)=>{
        const mb=DB.membros.find(m=>m.id===item.membroId);
        const nomeCell=\`\${mb?mb.nome:'?'}\${item.descricao?\`<br><span style="font-size:.7rem;color:var(--txt2)">\${item.descricao}</span>\`:''}\`;
        let detalheCell='';
        if(item.fonte==='batuta'){
          detalheCell=\`<span style="font-size:.75rem;color:var(--txt2);font-style:italic">Importado do Batuta</span>\`;
        } else {
          const parts=[];
          if(item.brahma)parts.push(item.brahma+'× Brahma');
          if(item.heineken)parts.push(item.heineken+'× Heineken');
          if(item.fernet)parts.push(item.fernet+'× Fernet');
          if(item.refrig)parts.push(item.refrig+'× Refri');
          if(item.agua)parts.push(item.agua+'× Água');
          if(item.desconto)parts.push('Desc. '+item.desconto+'%');
          detalheCell=parts.join(' · ')||'—';
        }
        return\`<tr>
          <td>\${nomeCell}</td>
          <td style="font-size:.8rem;color:var(--txt2)">\${detalheCell}</td>
          <td class="bold">\${brl(calcCmd(item))}</td>
          <td>\${item.status==='pago'?'<span class="badge bg-green">Pago</span>':'<span class="badge bg-red">Pendente</span>'}</td>
          <td class="admin-only" style="white-space:nowrap">
            \${item.status==='pendente'?\`<button class="btn btn-success btn-sm" onclick="marcarPago('\${j.id}',\${idx})">✓</button> \`:''}
            <button class="btn btn-danger btn-sm" onclick="removerComanda('\${j.id}',\${idx})">🗑️</button>
          </td>
        </tr>\`;
      }).join('')}</tbody></table>\`;`;

  if (!html.includes(OLD_TBL)) {
    console.error('ERROR: Could not find original renderComandas table template. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_TBL, NEW_TBL);
  console.log('  → Applied: renderComandas table updated with Batuta support.');
  changed = true;
}

// ─── STEP 3: Inject BATUTA_DEBITOS_DATA + importarComandasBatuta() ───
console.log('\n[3/4] Checking BATUTA_DEBITOS_DATA injection...');
const GUARD_3 = 'const BATUTA_DEBITOS_DATA';
if (html.includes(GUARD_3)) {
  console.log('  → Already applied. Skipping.');
} else {
  const INJECT_JS = `
// ── BATUTA IMPORT ──
const BATUTA_DEBITOS_DATA = [
  // [nomeNormalizado, descricao, data, valor]
  ['alemao sem dente','Grêmio x São Luiz (17/01)','2026-01-17',50.00],
  ['peixoto','Grêmio x Confiança (21/04)','2026-04-21',156.00],
  ['peixoto','Grêmio x Coritiba (26/04)','2026-04-26',165.00],
  ['costelinha','Grêmio x Coritiba (26/04)','2026-04-26',91.00],
  ['peixoto','Grêmio x Flamengo (10/05)','2026-05-10',142.00],
  ['guigo','Bahia x Grêmio (17/05)','2026-05-17',30.00],
  ['jackson','Bahia x Grêmio (17/05)','2026-05-17',99.00],
  ['peixoto','Bahia x Grêmio (17/05)','2026-05-17',30.00],
  ['peixoto','Grêmio x Palestino (19/05)','2026-05-19',170.00],
  ['portella','Grêmio x Palestino (19/05)','2026-05-19',216.00],
  ['jackson','Grêmio x Palestino (19/05)','2026-05-19',89.60],
  ['leo','Grêmio x Palestino (19/05)','2026-05-19',42.00],
  ['ariel','Débitos acumulados 2026','2026-05-25',731.20],
];

const BATUTA_IMPORT_JOGO_ID = 'batuta-import-2026';

function importarComandasBatuta(){
  if(!IS_ADMIN)return;
  if(DB.comandas[BATUTA_IMPORT_JOGO_ID]&&DB.comandas[BATUTA_IMPORT_JOGO_ID].length){
    alert('Importação já realizada. Para reimportar, remova o jogo "Débitos em Aberto — Batuta" na aba Comandas primeiro.');return;
  }
  if(!confirm('Importar os débitos em aberto do Batuta (R$ 2.011,80 em 13 lançamentos)?\\nIsso vai criar comandas pendentes para cada sócio listado.'))return;
  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/\\s+/g,' ').trim();
  if(!DB.jogos.find(j=>j.id===BATUTA_IMPORT_JOGO_ID)){
    DB.jogos.push({id:BATUTA_IMPORT_JOGO_ID,data:'2026-05-25',adv:'📊 Débitos em Aberto — Batuta',comp:'',local:'casa',rec:0,obs:'Importação automática dos débitos em aberto registrados na planilha do Batuta (atualizada em mai/2026). Total: R$ 2.011,80.'});
  }
  const comandas=[];
  const naoEncontrados=[];
  BATUTA_DEBITOS_DATA.forEach(([nNorm,descricao,data,valor])=>{
    const mb=DB.membros.find(m=>norm(m.nome).startsWith(nNorm)||norm(m.apelido||'').startsWith(nNorm)||norm(m.nome).includes(nNorm));
    if(!mb){naoEncontrados.push(nNorm);return;}
    comandas.push({membroId:mb.id,descricao,data,valor,status:'pendente',fonte:'batuta'});
  });
  DB.comandas[BATUTA_IMPORT_JOGO_ID]=comandas;
  salvarDB();renderComandas();
  const total=BATUTA_DEBITOS_DATA.reduce((s,[,,,v])=>s+v,0);
  let msg=\`✅ \${comandas.length} débitos importados!\\nTotal: \${brl(total)}\`;
  if(naoEncontrados.length)msg+=\`\\n\\n⚠️ Sócios não encontrados (verifique os nomes):\\n\${naoEncontrados.join(', ')}\`;
  alert(msg);
}
`;
  const lastScriptClose = html.lastIndexOf('</script>');
  if (lastScriptClose === -1) {
    console.error('ERROR: Could not find </script> tag. Aborting.');
    process.exit(1);
  }
  html = html.slice(0, lastScriptClose) + INJECT_JS + html.slice(lastScriptClose);
  console.log('  → Applied: BATUTA_DEBITOS_DATA and importarComandasBatuta() injected.');
  changed = true;
}

// ─── STEP 4: Add "Importar Batuta" button in comandas .sh ───
console.log('\n[4/4] Checking Importar Batuta button...');
const GUARD_4 = 'importarComandasBatuta()';
if (html.includes(GUARD_4) && html.includes('onclick="importarComandasBatuta()"')) {
  // Check if button in sh div
  const shIdx = html.indexOf('<div class="sh"><h2>Comandas</h2>');
  if (shIdx !== -1) {
    const after = html.slice(shIdx, shIdx + 200);
    if (after.includes('importarComandasBatuta()')) {
      console.log('  → Button already present in .sh. Skipping.');
    } else {
      const OLD_SH = '<div class="sh"><h2>Comandas</h2></div>';
      const NEW_SH = '<div class="sh"><h2>Comandas</h2><button class="btn btn-secondary btn-sm admin-only" onclick="importarComandasBatuta()">📥 Importar Batuta</button></div>';
      if (!html.includes(OLD_SH)) {
        console.error('ERROR: Could not find comandas .sh div. Aborting.');
        process.exit(1);
      }
      html = html.replace(OLD_SH, NEW_SH);
      console.log('  → Applied: Importar Batuta button added to comandas header.');
      changed = true;
    }
  }
} else {
  const OLD_SH = '<div class="sh"><h2>Comandas</h2></div>';
  const NEW_SH = '<div class="sh"><h2>Comandas</h2><button class="btn btn-secondary btn-sm admin-only" onclick="importarComandasBatuta()">📥 Importar Batuta</button></div>';
  if (!html.includes(OLD_SH)) {
    console.error('ERROR: Could not find comandas .sh div. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_SH, NEW_SH);
  console.log('  → Applied: Importar Batuta button added to comandas header.');
  changed = true;
}

// ─── SAVE ───
if (changed) {
  writeFileSync(FILE, html, 'utf8');
  console.log(`\nFile saved. New size: ${html.length} bytes (was ${originalSize} bytes, +${html.length - originalSize} bytes)`);
} else {
  console.log('\nNo changes made (all steps already applied).');
}

// ─── VERIFICAÇÃO ───
console.log('\n=== VERIFICAÇÃO ===');
const verify = readFileSync(FILE, 'utf8');
const checks = [
  ['calcCmd valor support', 'if(i.valor!=null&&i.desconto==null)return i.valor;'],
  ['renderComandas new header', 'Sócio / Descrição'],
  ['detalheCell batuta', "item.fonte==='batuta'"],
  ['BATUTA_DEBITOS_DATA', 'const BATUTA_DEBITOS_DATA'],
  ['BATUTA_IMPORT_JOGO_ID', "const BATUTA_IMPORT_JOGO_ID = 'batuta-import-2026'"],
  ['importarComandasBatuta fn', 'function importarComandasBatuta()'],
  ['Importar Batuta button', 'onclick="importarComandasBatuta()"'],
];
let allOk = true;
checks.forEach(([label, str]) => {
  const ok = verify.includes(str);
  console.log(`  [${ok ? 'OK' : 'FAIL'}] ${label}`);
  if (!ok) allOk = false;
});
if (!allOk) {
  console.error('\nSome checks FAILED.');
  process.exit(1);
}
console.log('\nAll checks passed!');

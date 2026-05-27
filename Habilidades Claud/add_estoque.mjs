import { readFileSync, writeFileSync } from 'fs';

const FILE = 'C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html';

console.log('=== add_estoque.mjs ===');
console.log(`Reading: ${FILE}`);
let html = readFileSync(FILE, 'utf8');
const originalSize = html.length;
console.log(`File size: ${originalSize} bytes`);

let changed = false;

// ─── STEP 1: CSS ───
console.log('\n[1/7] Checking Estoque CSS...');
const GUARD_CSS = '/* ── ESTOQUE ── */';
if (html.includes(GUARD_CSS)) {
  console.log('  → Already applied. Skipping.');
} else {
  const CSS_BLOCK = `/* ── ESTOQUE ── */
.est-wrap{overflow-x:auto;border-radius:var(--r);border:1px solid var(--border);background:var(--card);margin-bottom:16px}
.est-table{width:100%;border-collapse:collapse;min-width:960px;font-size:.78rem}
.est-table th{background:var(--acc);color:#fff;padding:7px 8px;text-align:center;font-size:.72rem;font-weight:700;white-space:nowrap;border:1px solid rgba(255,255,255,.15)}
.est-table th.est-loc{text-align:left;min-width:130px}
.est-table td{padding:5px 6px;text-align:center;border:1px solid var(--border);vertical-align:middle}
.est-table td.est-loc-cell{font-size:.78rem;font-weight:700;color:var(--txt2);text-align:left;padding-left:10px;background:var(--card2);white-space:nowrap}
.est-table tr.est-total td{background:rgba(26,58,107,.06);font-weight:700;color:var(--acc)}
.est-table tr.est-total td.est-loc-cell{color:var(--acc)}
.est-input{width:44px;text-align:center;border:1px solid var(--border);border-radius:4px;padding:3px 2px;font-size:.78rem;background:var(--card);color:var(--txt)}
.est-input:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 2px rgba(26,58,107,.15)}
.est-hist-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);margin-bottom:10px}
.est-hist-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;gap:10px}
.est-hist-body{padding:0 14px 14px;border-top:1px solid var(--border)}
.est-total-pill{font-size:.72rem;font-weight:700;background:var(--acc);color:#fff;border-radius:10px;padding:2px 8px}
</style>`;
  if (!html.includes('</style>')) {
    console.error('ERROR: Could not find </style> tag. Aborting.');
    process.exit(1);
  }
  html = html.replace('</style>', CSS_BLOCK);
  console.log('  → Applied: Estoque CSS added before </style>.');
  changed = true;
}

// ─── STEP 2: Nav item ───
console.log('\n[2/7] Checking Estoque nav item...');
const GUARD_NAV = 'data-tab="estoque"';
if (html.includes(GUARD_NAV)) {
  console.log('  → Already applied. Skipping.');
} else {
  const OLD_NAV = `  <div class="nav-item" data-tab="jogos" onclick="showTab('jogos')"><span class="ico">⚽</span>Jogos</div>`;
  const NEW_NAV = `  <div class="nav-item" data-tab="estoque" onclick="showTab('estoque')"><span class="ico">📦</span>Estoque</div>
  <div class="nav-item" data-tab="jogos" onclick="showTab('jogos')"><span class="ico">⚽</span>Jogos</div>`;
  if (!html.includes(OLD_NAV)) {
    console.error('ERROR: Could not find jogos nav item. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_NAV, NEW_NAV);
  console.log('  → Applied: Estoque nav item added before Jogos.');
  changed = true;
}

// ─── STEP 3: HTML tab ───
console.log('\n[3/7] Checking Estoque HTML tab...');
const GUARD_TAB = '<!-- ESTOQUE -->';
if (html.includes(GUARD_TAB)) {
  console.log('  → Already applied. Skipping.');
} else {
  const OLD_JOGOS_COMMENT = '<!-- JOGOS -->';
  const NEW_TAB = `<!-- ESTOQUE -->
<div id="tab-estoque" class="page">
  <div class="sh">
    <h2>Estoque do Bar</h2>
    <button class="btn btn-primary btn-sm admin-only" onclick="novaConferenciaEstoque()">+ Nova Conferência</button>
  </div>

  <!-- Formulário de conferência -->
  <div id="estConferenciaForm" style="display:none;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-bottom:16px">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px">
      <div class="fg"><label class="lbl">Data</label><input type="date" id="estData" class="select"></div>
      <div class="fg"><label class="lbl">Responsável</label><input type="text" id="estResponsavel" class="select" placeholder="Nome do responsável"></div>
      <div class="fg"><label class="lbl">Evento / Jogo</label><input type="text" id="estEvento" class="select" placeholder="Ex: Grêmio x Santos"></div>
    </div>
    <div class="est-wrap">
      <table class="est-table" id="estGrid"></table>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-primary" onclick="salvarConferenciaEstoque()">💾 Salvar Conferência</button>
      <button class="btn btn-ghost" onclick="cancelarConferenciaEstoque()">Cancelar</button>
    </div>
  </div>

  <!-- Histórico -->
  <div id="estHistorico">
    <div class="empty">Nenhuma conferência registrada. Clique em "+ Nova Conferência" para começar.</div>
  </div>
</div>

<!-- JOGOS -->`;
  if (!html.includes(OLD_JOGOS_COMMENT)) {
    console.error('ERROR: Could not find <!-- JOGOS --> comment. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_JOGOS_COMMENT, NEW_TAB);
  console.log('  → Applied: Estoque HTML tab inserted before <!-- JOGOS -->.');
  changed = true;
}

// ─── STEP 4: TAB_RENDERERS ───
console.log('\n[4/7] Checking TAB_RENDERERS update...');
const GUARD_TAB_RENDERERS = 'estoque:renderEstoque';
if (html.includes(GUARD_TAB_RENDERERS)) {
  console.log('  → Already applied. Skipping.');
} else {
  const OLD_RENDERERS = `const TAB_RENDERERS={
  dashboard:renderDash,calendario:renderSedeCalendar,jogos:renderJogos,
  mensalidades:renderMensalidades,resumo:renderResumo,comandas:renderComandas,
  bar:renderContaBar,holding:renderContaHolding,membros:renderMembros
};`;
  const NEW_RENDERERS = `const TAB_RENDERERS={
  dashboard:renderDash,calendario:renderSedeCalendar,jogos:renderJogos,
  estoque:renderEstoque,mensalidades:renderMensalidades,resumo:renderResumo,
  comandas:renderComandas,bar:renderContaBar,holding:renderContaHolding,membros:renderMembros
};`;
  if (!html.includes(OLD_RENDERERS)) {
    console.error('ERROR: Could not find TAB_RENDERERS. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_RENDERERS, NEW_RENDERERS);
  console.log('  → Applied: TAB_RENDERERS updated with estoque:renderEstoque.');
  changed = true;
}

// ─── STEP 5: DB default ───
console.log('\n[5/7] Checking DB default update...');
const GUARD_DB = 'membros,mensalidades,comandas:{},estoque:[]';
if (html.includes(GUARD_DB)) {
  console.log('  → Already applied. Skipping.');
} else {
  const OLD_DB = 'membros,mensalidades,comandas:{},';
  const NEW_DB = 'membros,mensalidades,comandas:{},estoque:[],';
  if (!html.includes(OLD_DB)) {
    console.error('ERROR: Could not find DB default line. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_DB, NEW_DB);
  console.log('  → Applied: DB default updated with estoque:[].');
  changed = true;
}

// ─── STEP 6: DB restore ───
console.log('\n[6/7] Checking DB restore update...');
const GUARD_RESTORE = 'r.estoque=toArr(data.estoque||[]);';
if (html.includes(GUARD_RESTORE)) {
  console.log('  → Already applied. Skipping.');
} else {
  const OLD_RESTORE = `  if(data.comandas)Object.entries(data.comandas).forEach(([k,v])=>{r.comandas[k]=toArr(v);});`;
  const NEW_RESTORE = `  if(data.comandas)Object.entries(data.comandas).forEach(([k,v])=>{r.comandas[k]=toArr(v);});
  r.estoque=toArr(data.estoque||[]);`;
  if (!html.includes(OLD_RESTORE)) {
    console.error('ERROR: Could not find DB restore line. Aborting.');
    process.exit(1);
  }
  html = html.replace(OLD_RESTORE, NEW_RESTORE);
  console.log('  → Applied: DB restore updated with estoque parsing.');
  changed = true;
}

// ─── STEP 7: JS functions injection ───
console.log('\n[7/7] Checking Estoque JS functions...');
const GUARD_JS = '// ── ESTOQUE ──';
if (html.includes(GUARD_JS)) {
  console.log('  → Already applied. Skipping.');
} else {
  const INJECT_JS = `
// ── ESTOQUE ──
const ESTOQUE_LOCAIS = [
  {id:'freezer_skol',label:'Freezer Skol'},
  {id:'freezer_bud',label:'Freezer Bud'},
  {id:'freezer_preto',label:'Freezer Preto'},
  {id:'freezer_cozinha',label:'Freezer Cozinha'},
  {id:'geladeira',label:'Geladeira'},
  {id:'freezer_h',label:'Freezer Horizontal'},
  {id:'fora_gelo',label:'Fora do Gelo'},
];
const ESTOQUE_PRODUTOS = [
  {id:'brahma',label:'Brahma'},
  {id:'heineken',label:'Heineken'},
  {id:'skol_beats',label:'Skol Beats'},
  {id:'fernet',label:'Fernet'},
  {id:'cachaca',label:'Cachaça'},
  {id:'hk_zero',label:'Hk Zero'},
  {id:'coca_lata',label:'Coca Lata'},
  {id:'coca_zero',label:'Coca Zero'},
  {id:'coca_2l',label:'Coca 2L'},
  {id:'coca_zero2l',label:'Coca Zero 2L'},
  {id:'agua_sg',label:'Água S/Gás'},
  {id:'agua_cg',label:'Água C/Gás'},
];

let _estConferenciaAtiva = null;

function _estGridVazio(){
  const g={};
  ESTOQUE_LOCAIS.forEach(l=>{
    g[l.id]={};
    ESTOQUE_PRODUTOS.forEach(p=>{g[l.id][p.id]=0;});
  });
  return g;
}

function novaConferenciaEstoque(){
  _estConferenciaAtiva={id:null,data:new Date().toISOString().slice(0,10),responsavel:'',evento:'',grid:_estGridVazio()};
  document.getElementById('estData').value=_estConferenciaAtiva.data;
  document.getElementById('estResponsavel').value='';
  document.getElementById('estEvento').value='';
  _renderEstGrid();
  document.getElementById('estConferenciaForm').style.display='block';
  document.getElementById('estConferenciaForm').scrollIntoView({behavior:'smooth'});
}

function cancelarConferenciaEstoque(){
  _estConferenciaAtiva=null;
  document.getElementById('estConferenciaForm').style.display='none';
}

function _renderEstGrid(){
  const tbl=document.getElementById('estGrid');
  if(!tbl||!_estConferenciaAtiva)return;
  const {grid}=_estConferenciaAtiva;
  // Header
  const hdrCols=ESTOQUE_PRODUTOS.map(p=>\`<th>\${p.label}</th>\`).join('');
  // Rows
  const rows=ESTOQUE_LOCAIS.map(l=>{
    const cells=ESTOQUE_PRODUTOS.map(p=>{
      const val=grid[l.id]?.[p.id]||0;
      return \`<td><input class="est-input" type="number" min="0" step="1" value="\${val}" oninput="_estUpdate('\${l.id}','\${p.id}',this.value)"></td>\`;
    }).join('');
    return \`<tr><td class="est-loc-cell">\${l.label}</td>\${cells}</tr>\`;
  }).join('');
  // Total row
  const totCols=ESTOQUE_PRODUTOS.map(p=>{
    const tot=ESTOQUE_LOCAIS.reduce((s,l)=>(s+(grid[l.id]?.[p.id]||0)),0);
    return \`<td>\${tot||'—'}</td>\`;
  }).join('');
  tbl.innerHTML=\`<thead><tr><th class="est-loc">Local</th>\${hdrCols}</tr></thead><tbody>\${rows}<tr class="est-total"><td class="est-loc-cell">TOTAL</td>\${totCols}</tr></tbody>\`;
}

function _estUpdate(localId,prodId,val){
  if(!_estConferenciaAtiva)return;
  if(!_estConferenciaAtiva.grid[localId])_estConferenciaAtiva.grid[localId]={};
  _estConferenciaAtiva.grid[localId][prodId]=Math.max(0,parseInt(val)||0);
  // Update only total row to avoid losing focus
  const rows=document.querySelectorAll('#estGrid tbody tr');
  const totRow=rows[rows.length-1];
  if(!totRow)return;
  const tds=totRow.querySelectorAll('td');
  ESTOQUE_PRODUTOS.forEach((p,i)=>{
    const tot=ESTOQUE_LOCAIS.reduce((s,l)=>(s+(_estConferenciaAtiva.grid[l.id]?.[p.id]||0)),0);
    tds[i+1].textContent=tot||'—';
  });
}

function salvarConferenciaEstoque(){
  if(!IS_ADMIN||!_estConferenciaAtiva)return;
  const data=document.getElementById('estData').value;
  const resp=document.getElementById('estResponsavel').value.trim();
  const evt=document.getElementById('estEvento').value.trim();
  if(!data){alert('Informe a data.');return;}
  if(!resp){alert('Informe o responsável.');return;}
  const conf={
    id:_estConferenciaAtiva.id||uid(),
    data,responsavel:resp,evento:evt,
    grid:JSON.parse(JSON.stringify(_estConferenciaAtiva.grid)),
    criadoEm:Date.now()
  };
  if(!DB.estoque)DB.estoque=[];
  const idx=DB.estoque.findIndex(c=>c.id===conf.id);
  if(idx>=0)DB.estoque[idx]=conf;else DB.estoque.push(conf);
  DB.estoque.sort((a,b)=>b.data.localeCompare(a.data));
  salvarDB();
  cancelarConferenciaEstoque();
  renderEstoque();
  alert('Conferência salva com sucesso!');
}

function excluirConferenciaEstoque(id){
  if(!IS_ADMIN)return;
  if(!confirm('Excluir esta conferência?'))return;
  DB.estoque=(DB.estoque||[]).filter(c=>c.id!==id);
  salvarDB();renderEstoque();
}

function editarConferenciaEstoque(id){
  if(!IS_ADMIN)return;
  const conf=(DB.estoque||[]).find(c=>c.id===id);
  if(!conf)return;
  _estConferenciaAtiva={...conf,grid:JSON.parse(JSON.stringify(conf.grid))};
  document.getElementById('estData').value=conf.data;
  document.getElementById('estResponsavel').value=conf.responsavel;
  document.getElementById('estEvento').value=conf.evento;
  _renderEstGrid();
  document.getElementById('estConferenciaForm').style.display='block';
  document.getElementById('estConferenciaForm').scrollIntoView({behavior:'smooth'});
}

function renderEstoque(){
  if(!DB)return;
  const hist=document.getElementById('estHistorico');
  const confs=(DB.estoque||[]).sort((a,b)=>b.data.localeCompare(a.data));
  if(!confs.length){
    hist.innerHTML='<div class="empty">Nenhuma conferência registrada. Clique em "+ Nova Conferência" para começar.</div>';
    return;
  }
  hist.innerHTML=confs.map(conf=>{
    // Compute totals per product
    const totais={};
    ESTOQUE_PRODUTOS.forEach(p=>{
      totais[p.id]=ESTOQUE_LOCAIS.reduce((s,l)=>(s+(conf.grid[l.id]?.[p.id]||0)),0);
    });
    const totaisRow=ESTOQUE_PRODUTOS.filter(p=>totais[p.id]>0).map(p=>\`<span style="font-size:.75rem;background:var(--card2);border:1px solid var(--border);border-radius:6px;padding:2px 8px;margin:2px 2px 0;display:inline-block">\${p.label}: <b>\${totais[p.id]}</b></span>\`).join('');
    // Full read-only grid
    const hdrCols=ESTOQUE_PRODUTOS.map(p=>\`<th>\${p.label}</th>\`).join('');
    const rows=ESTOQUE_LOCAIS.map(l=>{
      const hasAny=ESTOQUE_PRODUTOS.some(p=>(conf.grid[l.id]?.[p.id]||0)>0);
      if(!hasAny)return'';
      const cells=ESTOQUE_PRODUTOS.map(p=>{
        const v=conf.grid[l.id]?.[p.id]||0;
        return \`<td style="\${v>0?'font-weight:700;color:var(--acc)':''}">\${v||'—'}</td>\`;
      }).join('');
      return \`<tr><td class="est-loc-cell">\${l.label}</td>\${cells}</tr>\`;
    }).join('');
    const totCols=ESTOQUE_PRODUTOS.map(p=>{
      const tot=totais[p.id];
      return \`<td>\${tot||'—'}</td>\`;
    }).join('');
    return \`<div class="est-hist-card">
      <div class="est-hist-hdr" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
        <div>
          <div style="font-size:13px;font-weight:700">\${fmtD(conf.data)}\${conf.evento?' · '+conf.evento:''}</div>
          <div style="font-size:11px;color:var(--txt2);margin-top:2px">Responsável: \${conf.responsavel}</div>
          <div style="margin-top:6px">\${totaisRow}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0" class="admin-only">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();editarConferenciaEstoque('\${conf.id}')">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();excluirConferenciaEstoque('\${conf.id}')">🗑️</button>
        </div>
      </div>
      <div class="est-hist-body" style="display:none">
        <div class="est-wrap" style="margin-top:8px">
          <table class="est-table">
            <thead><tr><th class="est-loc">Local</th>\${hdrCols}</tr></thead>
            <tbody>\${rows}<tr class="est-total"><td class="est-loc-cell">TOTAL</td>\${totCols}</tr></tbody>
          </table>
        </div>
      </div>
    </div>\`;
  }).join('');
}
`;
  const lastScriptClose = html.lastIndexOf('</script>');
  if (lastScriptClose === -1) {
    console.error('ERROR: Could not find </script> tag. Aborting.');
    process.exit(1);
  }
  html = html.slice(0, lastScriptClose) + INJECT_JS + html.slice(lastScriptClose);
  console.log('  → Applied: Estoque JS functions injected.');
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
  ['Estoque CSS', '/* ── ESTOQUE ── */'],
  ['Estoque nav item', 'data-tab="estoque"'],
  ['Estoque HTML tab', '<!-- ESTOQUE -->'],
  ['tab-estoque div', 'id="tab-estoque"'],
  ['TAB_RENDERERS estoque', 'estoque:renderEstoque'],
  ['DB default estoque', 'comandas:{},estoque:[]'],
  ['DB restore estoque', 'r.estoque=toArr(data.estoque||[]);'],
  ['ESTOQUE_LOCAIS', 'const ESTOQUE_LOCAIS'],
  ['ESTOQUE_PRODUTOS', 'const ESTOQUE_PRODUTOS'],
  ['novaConferenciaEstoque fn', 'function novaConferenciaEstoque()'],
  ['salvarConferenciaEstoque fn', 'function salvarConferenciaEstoque()'],
  ['renderEstoque fn', 'function renderEstoque()'],
  ['excluirConferenciaEstoque fn', 'function excluirConferenciaEstoque(id)'],
  ['editarConferenciaEstoque fn', 'function editarConferenciaEstoque(id)'],
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

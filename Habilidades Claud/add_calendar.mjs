import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── Sanity: clean CDN script tags ───
html = html.replace(/(<script\s+src="[^"]*">)([\s\S]*?)(<\/script>)/g, (m, open, content, close) => {
  if (content.trim()) { console.log('Limpando CDN tag'); return open + close; }
  return m;
});

if (html.includes('sedeCalGrid') || html.includes('SEDE_CAL_SEED')) {
  console.log('Calendário já existe — abortando.'); process.exit(0);
}

// ─── 1. CSS ───
const calCSS = `
/* ── CALENDÁRIO SEDE ── */
.sc-wrap{display:grid;grid-template-columns:1fr 290px;gap:12px;align-items:start;margin-bottom:16px}
.sc-tabs{display:flex;gap:3px;flex-wrap:wrap;margin-bottom:10px}
.sc-tab{padding:3px 10px;border-radius:12px;border:1px solid var(--g2);background:#fff;font-size:.72rem;cursor:pointer;color:var(--g5);transition:all .12s;font-weight:500}
.sc-tab.active{background:var(--bl);color:#fff;border-color:var(--bl)}
.sc-cal-box{background:#fff;border-radius:var(--r);box-shadow:0 1px 3px rgba(0,0,0,.08);overflow:hidden}
.sc-cal{width:100%;border-collapse:collapse}
.sc-dow{background:var(--bd);color:rgba(255,255,255,.75);font-size:.65rem;font-weight:600;text-align:center;padding:6px 2px;text-transform:uppercase;letter-spacing:.3px}
.sc-day{vertical-align:top;border:1px solid var(--g2);cursor:pointer;transition:background .1s;width:14.28%}
.sc-day:hover{background:#f0f4ff}
.sc-day.other{background:#f8fafc;opacity:.5}
.sc-day.today .sc-dn{background:var(--bl);color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:11px}
.sc-day.selected{background:rgba(59,130,246,.07);box-shadow:inset 0 0 0 2px var(--ba)}
.sc-day-inner{height:100px;padding:5px;display:flex;flex-direction:column;gap:2px;overflow:hidden}
.sc-dn{font-size:12px;font-weight:700;color:var(--g5);margin-bottom:1px;line-height:1;flex-shrink:0}
.sc-ev{font-size:10px;border-radius:3px;padding:2px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;line-height:1.4;cursor:pointer}
.sc-ev.cat-gremio{background:rgba(0,74,148,.14);color:#003d7a}
.sc-ev.cat-selecao{background:rgba(0,156,0,.12);color:#065f46}
.sc-ev.cat-financeiro{background:rgba(217,119,6,.12);color:#92400e}
.sc-ev.cat-outros{background:rgba(100,116,139,.1);color:#475569}
.sc-chk-pill{font-size:10px;border-radius:3px;padding:2px 5px;font-weight:600;display:flex;align-items:center;gap:3px;overflow:hidden;line-height:1.4}
.sc-chk-bar{flex:1;height:3px;border-radius:2px;background:rgba(0,0,0,.12);overflow:hidden;min-width:12px}
.sc-chk-fill{height:100%;border-radius:2px;transition:width .2s}
.sc-more{font-size:9px;color:var(--g5);text-align:center;padding:1px 4px;background:var(--g);border-radius:3px;cursor:pointer;margin-top:auto}
.sc-legend{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
.sc-leg-item{font-size:11px;color:var(--g5);display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:10px;border:1px solid var(--g2);background:#fff}
.sc-leg-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.sc-panel{background:#fff;border-radius:var(--r);box-shadow:0 1px 3px rgba(0,0,0,.08);padding:12px 14px;margin-bottom:10px}
.sc-panel-hdr{font-size:.78rem;font-weight:600;color:var(--g7);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--g2)}
.sc-det-empty{font-size:.75rem;color:var(--g5);text-align:center;padding:10px 0;font-style:italic}
.sc-det-day{font-size:.82rem;font-weight:700;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--g2)}
.sc-det-ev{display:flex;align-items:flex-start;gap:7px;padding:7px 0;border-bottom:1px solid var(--g2)}
.sc-det-ev:last-child{border-bottom:none}
.sc-det-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px}
.sc-det-body{flex:1;min-width:0}
.sc-det-text{font-size:.78rem;color:var(--g7);line-height:1.4}
.sc-det-lbl{font-size:.67rem;font-weight:600;margin-top:1px;letter-spacing:.2px}
.sc-chk-item{display:flex;align-items:flex-start;gap:7px;padding:6px 0;border-bottom:1px solid var(--g2);font-size:.77rem;color:var(--g7);line-height:1.4;cursor:pointer}
.sc-chk-item:last-child{border-bottom:none}
.sc-chk-item input{margin-top:2px;flex-shrink:0;accent-color:var(--bl);width:14px;height:14px;cursor:pointer}
.sc-chk-done{text-decoration:line-through;opacity:.45}
.sc-sect-label{font-size:.68rem;font-weight:700;color:var(--g5);text-transform:uppercase;letter-spacing:.4px;margin:8px 0 3px;padding-top:4px;border-top:1px solid var(--g2)}
.sc-sect-label:first-child{border-top:none;margin-top:0;padding-top:0}
@media(max-width:700px){.sc-wrap{grid-template-columns:1fr}.sc-day-inner{height:72px}}`;

html = html.replace('</style>', calCSS + '\n</style>');
console.log('CSS adicionado.');

// ─── 2. HTML (substitui movimentações recentes) ───
const oldMovs = `  <div class="sh"><h2>Movimentações recentes — Conta Bar</h2></div>
  <div class="tw"><table id="dashMovs"><thead><tr><th>Data</th><th>Nome</th><th>Categoria</th><th>Entrada</th><th>Saída</th></tr></thead><tbody></tbody></table></div>`;

const calHTML = `  <!-- CALENDÁRIO & CHECKLIST -->
  <div class="sh" style="margin-top:2px"><h2>Calendário</h2></div>
  <div id="sedeCalTabs" class="sc-tabs"></div>
  <div class="sc-wrap">
    <div>
      <div class="sc-cal-box">
        <table id="sedeCalGrid" class="sc-cal"></table>
      </div>
      <div id="sedeCalLegend" class="sc-legend"></div>
    </div>
    <div>
      <div class="sc-panel" id="sedeChkPanel">
        <div class="sc-panel-hdr">✅ Checklist do Mês</div>
        <div id="sedeChkList"><div class="sc-det-empty">Carregando…</div></div>
      </div>
      <div class="sc-panel" id="sedeCalDetail">
        <div class="sc-det-empty">Clique em um dia para ver os eventos</div>
      </div>
    </div>
  </div>
  <!-- manter tabela oculta para não quebrar renderDash -->
  <table id="dashMovs" style="display:none"><tbody></tbody></table>`;

if (!html.includes(oldMovs)) {
  console.error('ERRO: não encontrou o bloco de movimentações recentes!'); process.exit(1);
}
html = html.replace(oldMovs, calHTML);
console.log('HTML do calendário adicionado.');

// ─── 3. JavaScript ───
const calJS = `
// ══════════════════════════════════════════════════════
// CALENDÁRIO & CHECKLIST — SEDE CAIXA BAIXA
// ══════════════════════════════════════════════════════

// ── Jogos confirmados (fontes: gremio.net + espn.com + cbf.com.br) ──
const SEDE_CAL_SEED = {
  // MAIO 2026
  "2026-05-26":["19:00 - Grêmio x Montevideo City Torque (Sul-Americana)"],
  "2026-05-30":["17:30 - Grêmio x Corinthians (Brasileirão)"],
  "2026-05-31":["17:30 - Brasil x Panamá (Amistoso)"],
  // JUNHO 2026
  "2026-06-06":["Brasil x Egito (Amistoso)"],
  "2026-06-13":["19:00 - Brasil x Marrocos — Copa do Mundo 2026 🏆"],
  "2026-06-19":["21:30 - Brasil x Haiti — Copa do Mundo 2026 🏆"],
  "2026-06-24":["19:00 - Brasil x Escócia — Copa do Mundo 2026 🏆"],
  // JULHO 2026
  "2026-07-22":["Grêmio x Mirassol (Fora) — Brasileirão"],
  "2026-07-25":["Grêmio x Fluminense — Brasileirão"],
  "2026-07-29":["Grêmio x Botafogo (Fora) — Brasileirão"],
  // AGOSTO 2026
  "2026-08-08":["Grêmio x São Paulo — Brasileirão"],
  "2026-08-15":["Grêmio x Atlético-MG (Fora) — Brasileirão"],
  "2026-08-22":["Grêmio x Red Bull Bragantino (Fora) — Brasileirão"],
  "2026-08-29":["Grêmio x Chapecoense — Brasileirão"],
  // SETEMBRO 2026
  "2026-09-05":["Grêmio x Vitória (Fora) — Brasileirão"],
  "2026-09-12":["Grêmio x Vasco da Gama — Brasileirão"],
  "2026-09-19":["Grêmio x Palmeiras — Brasileirão"],
  // OUTUBRO 2026
  "2026-10-07":["Grêmio x Remo (Fora) — Brasileirão"],
  "2026-10-10":["Grêmio x Internacional — Grenal Brasileirão"],
  "2026-10-17":["Grêmio x Cruzeiro — Brasileirão"],
  "2026-10-24":["Grêmio x Coritiba (Fora) — Brasileirão"],
  "2026-10-28":["Grêmio x Athletico Paranaense — Brasileirão"],
  // NOVEMBRO 2026
  "2026-11-04":["Grêmio x Flamengo (Fora) — Brasileirão"],
  "2026-11-18":["Grêmio x Bahia — Brasileirão"],
  "2026-11-21":["Grêmio x Santos (Fora) — Brasileirão"],
  "2026-11-28":["Grêmio x Corinthians (Fora) — Brasileirão"],
  // DEZEMBRO 2026
  "2026-12-02":["Grêmio x Mirassol — Brasileirão"],
};

// ── Categorias ──
const SEDE_CAL_CATS = {
  gremio:    {label:'Grêmio',     dot:'#004A94'},
  selecao:   {label:'Seleção',    dot:'#009c3b'},
  financeiro:{label:'Financeiro', dot:'#d97706'},
  outros:    {label:'Outros',     dot:'#64748b'},
};

function sedeCat(t) {
  const s = (t||'').toLowerCase();
  if (/grêmio|gremio|corinthians|fluminense|botafogo|palmeiras|flamengo|vasco|inter|atletico|cruzeiro|chapecoense|vitória|vitoria|santos|bragantino|coritiba|athletico|mirassol|remo|sul-americana|brasileirão|grenal/.test(s)) return 'gremio';
  if (/brasil|seleção|selecao|copa do mundo|marrocos|haiti|escócia|escocia|panamá|panama|egito|amistoso/.test(s)) return 'selecao';
  if (/saldo|extrato|mensalidade|relatório|relatorio|cobrança|cobranca|pagamento|importar|reconciliar|exportar|fechamento|inadimplente/.test(s)) return 'financeiro';
  return 'outros';
}

// ── Checklist mensal de pendências financeiras ──
const SEDE_CHECKLIST = [
  { section:'📅 Dia 1 — Início do Mês', day:1, items:[
    {id:'s01', text:'Verificar saldo Conta Bar (InfinitePay)'},
    {id:'s02', text:'Verificar saldo Conta Holding (PicPay)'},
    {id:'s03', text:'Cobrar inadimplentes do mês anterior via WhatsApp'},
    {id:'s04', text:'Lançar mensalidades pagas no mês corrente'},
  ]},
  { section:'📥 Dia 5 — Extratos', day:5, items:[
    {id:'s05', text:'Importar extrato Conta Bar (XLSX ou PDF)'},
    {id:'s06', text:'Importar extrato Conta Holding (XLSX ou PDF)'},
  ]},
  { section:'🔄 Dia 15 — Conferência', day:15, items:[
    {id:'s07', text:'Reconciliar mensalidades via Conta Holding'},
    {id:'s08', text:'Conferir mensalidades do mês (quem pagou / quem falta)'},
  ]},
  { section:'📊 Fim do Mês — Fechamento', day:-1, items:[
    {id:'s09', text:'Exportar planilha de mensalidades do mês'},
    {id:'s10', text:'Fechar relatório financeiro do mês'},
    {id:'s11', text:'Verificar inadimplentes e definir ações'},
  ]},
];

// ── Estado ──
let _sedeCalData = JSON.parse(localStorage.getItem('sede_cal') || '{}');
let _sedeChkData = JSON.parse(localStorage.getItem('sede_chk') || '{}');
let _sedeCalMonth = new Date().getMonth() + 1;
let _sedeCalSel = '';
let _sedeCalCache = {};
function _saveSedeChk() { localStorage.setItem('sede_chk', JSON.stringify(_sedeChkData)); }
function _saveSedeCalEv() { localStorage.setItem('sede_cal', JSON.stringify(_sedeCalData)); }

function _sedeDaysInMonth(m) { return new Date(2026, m, 0).getDate(); }

function _sedeGetChkState(month) {
  if (!_sedeChkData[month]) _sedeChkData[month] = {};
  return _sedeChkData[month];
}

function toggleSedeCTask(month, tid) {
  const st = _sedeGetChkState(month);
  st[tid] = !st[tid];
  _saveSedeChk();
  renderSedeCalendar();
  renderSedeChkList(_sedeCalMonth);
  if (_sedeCalSel) renderSedeCalDetail(_sedeCalSel);
}

function _sedeGetEventsForDay(ds) {
  const [, ms, dd] = ds.split('-');
  const mo = parseInt(ms, 10);
  const d  = parseInt(dd, 10);
  const month = '2026-' + ms;
  const st = _sedeGetChkState(month);
  const lastDay = _sedeDaysInMonth(mo);

  // Checklist items that fall on this day
  const chkEvs = [];
  SEDE_CHECKLIST.forEach(sec => {
    const secDay = sec.day === -1 ? lastDay : sec.day;
    if (secDay === d) {
      sec.items.forEach(item => {
        chkEvs.push({
          id:'_chk_'+item.id+'_'+month,
          text: item.text,
          type:'checklist',
          cat:'financeiro',
          tid: item.id,
          chkMonth: month,
          done: !!st[item.id]
        });
      });
    }
  });

  // Seed events (football)
  const hidden = JSON.parse(localStorage.getItem('sede_hidden_seeds') || '{}')[ds] || [];
  const seedEvs = (SEDE_CAL_SEED[ds] || [])
    .filter(t => !hidden.includes(t))
    .map(t => ({ id:'_s_'+ds+'_'+t, text:t, type:'seed', cat:sedeCat(t) }));

  // User events
  const userEvs = (_sedeCalData[ds] || []).map(e => ({ ...e, type:'user' }));

  const all = [...seedEvs, ...userEvs, ...chkEvs];
  all.sort((a,b) => {
    const ta = a.time||''; const tb = b.time||'';
    if (!ta && !tb) return 0; if (!ta) return 1; if (!tb) return -1;
    return ta.localeCompare(tb);
  });
  return all;
}

const _SEDE_DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const _SEDE_DOW_FULL = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
const _SEDE_MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function renderSedeCalendar() {
  _sedeCalCache = {};
  const tabsEl = document.getElementById('sedeCalTabs');
  if (!tabsEl) return;
  if (!tabsEl.children.length) {
    tabsEl.innerHTML = _SEDE_MESES.map((m,i) =>
      \`<button class="sc-tab" onclick="_sedeCalMonth=\${i+1};renderSedeCalendar();\${i+1===new Date().getMonth()+1?'renderSedeChkList('+( i+1)+')':''}">\${m.slice(0,3)}</button>\`
    ).join('');
  }
  Array.from(tabsEl.children).forEach((btn,i) => btn.classList.toggle('active', i+1 === _sedeCalMonth));
  renderSedeChkList(_sedeCalMonth);

  const todayStr = new Date().toISOString().slice(0,10);
  const firstDow = new Date(2026, _sedeCalMonth-1, 1).getDay();
  const daysInM  = _sedeDaysInMonth(_sedeCalMonth);
  const daysInPrev = _sedeDaysInMonth(_sedeCalMonth === 1 ? 12 : _sedeCalMonth-1);
  const cells = [];

  // Prev-month filler
  for (let d = firstDow-1; d >= 0; d--) {
    const pDay = daysInPrev - d;
    const pM = _sedeCalMonth === 1 ? 12 : _sedeCalMonth-1;
    const ds = \`2026-\${String(pM).padStart(2,'0')}-\${String(pDay).padStart(2,'0')}\`;
    cells.push(\`<td class="sc-day other" data-ds="\${ds}" onclick="selectSedeDay('\${ds}')"><div class="sc-day-inner"><div class="sc-dn">\${pDay}</div></div></td>\`);
  }

  // Current month
  for (let d = 1; d <= daysInM; d++) {
    const ds = \`2026-\${String(_sedeCalMonth).padStart(2,'0')}-\${String(d).padStart(2,'0')}\`;
    const isToday = ds === todayStr;
    const isSel = ds === _sedeCalSel;
    const evs = _sedeGetEventsForDay(ds);
    evs.forEach((ev,i) => { _sedeCalCache[ds+'_'+i] = ev; });

    const chkEvs = evs.filter(e => e.type === 'checklist');
    const regEvs = evs.filter(e => e.type !== 'checklist');
    let evHtml = '';

    if (chkEvs.length) {
      const done = chkEvs.filter(e => e.done).length;
      const pct  = Math.round(done/chkEvs.length*100);
      const allDone = done === chkEvs.length;
      const color = SEDE_CAL_CATS.financeiro.dot;
      evHtml += \`<div class="sc-chk-pill" style="background:\${color}1a;color:\${color};border-left:2px solid \${color}" onclick="event.stopPropagation();selectSedeDay('\${ds}')" title="\${done}/\${chkEvs.length} tarefas concluídas">\${allDone?'✅':'☐'} <span>\${done}/\${chkEvs.length}</span><div class="sc-chk-bar"><div class="sc-chk-fill" style="width:\${pct}%;background:\${color}"></div></div></div>\`;
    }
    const MAX = 3;
    regEvs.slice(0, MAX).forEach(ev => {
      const cat = ev.cat||'outros';
      const tpfx = ev.time ? \`<b style="margin-right:2px">\${ev.time}</b> \` : '';
      evHtml += \`<div class="sc-ev cat-\${cat}" onclick="event.stopPropagation();selectSedeDay('\${ds}')" title="\${ev.text}">\${tpfx}\${ev.text}</div>\`;
    });
    if (regEvs.length > MAX) {
      evHtml += \`<div class="sc-more" onclick="event.stopPropagation();selectSedeDay('\${ds}')">+\${regEvs.length-MAX} mais</div>\`;
    }
    cells.push(\`<td class="sc-day\${isToday?' today':''}\${isSel?' selected':''}" data-ds="\${ds}" onclick="selectSedeDay('\${ds}')"><div class="sc-day-inner"><div class="sc-dn">\${d}</div>\${evHtml}</div></td>\`);
  }

  // Next-month filler (pad to 42 cells)
  const rem = 42 - (firstDow + daysInM);
  const nM = _sedeCalMonth === 12 ? 1 : _sedeCalMonth+1;
  for (let d = 1; d <= rem; d++) {
    const ds = \`2026-\${String(nM).padStart(2,'0')}-\${String(d).padStart(2,'0')}\`;
    cells.push(\`<td class="sc-day other" data-ds="\${ds}" onclick="selectSedeDay('\${ds}')"><div class="sc-day-inner"><div class="sc-dn">\${d}</div></div></td>\`);
  }

  const hdr = '<tr>' + _SEDE_DOW.map(dw => \`<th class="sc-dow">\${dw}</th>\`).join('') + '</tr>';
  let body = '';
  for (let r = 0; r < 6; r++) body += '<tr>' + cells.slice(r*7, (r+1)*7).join('') + '</tr>';
  document.getElementById('sedeCalGrid').innerHTML = \`<thead>\${hdr}</thead><tbody>\${body}</tbody>\`;

  // Legend
  const legEl = document.getElementById('sedeCalLegend');
  if (legEl) legEl.innerHTML = Object.entries(SEDE_CAL_CATS).map(([,v]) =>
    \`<span class="sc-leg-item"><span class="sc-leg-dot" style="background:\${v.dot}"></span>\${v.label}</span>\`
  ).join('');

  if (_sedeCalSel) renderSedeCalDetail(_sedeCalSel);
}

function selectSedeDay(ds) {
  _sedeCalSel = ds;
  document.querySelectorAll('#sedeCalGrid .sc-day').forEach(el => el.classList.toggle('selected', el.dataset.ds === ds));
  renderSedeCalDetail(ds);
}

function renderSedeCalDetail(ds) {
  const el = document.getElementById('sedeCalDetail');
  if (!el) return;
  const evs = _sedeGetEventsForDay(ds);
  const [y,m,d] = ds.split('-');
  const dow = _SEDE_DOW_FULL[new Date(Number(y),Number(m)-1,Number(d)).getDay()];
  let h = \`<div class="sc-det-day">\${dow}, \${d}/\${m}/\${y}</div>\`;
  if (!evs.length) {
    h += '<div class="sc-det-empty">Nenhum evento neste dia.</div>';
  } else {
    evs.forEach((ev, i) => {
      const C = SEDE_CAL_CATS[ev.cat||'outros'];
      if (ev.type === 'checklist') {
        h += \`<div class="sc-det-ev"><label style="display:flex;align-items:flex-start;gap:7px;cursor:pointer;width:100%"><input type="checkbox" style="margin-top:3px;flex-shrink:0;accent-color:\${C.dot};width:14px;height:14px;cursor:pointer" \${ev.done?'checked':''} onchange="toggleSedeCTask('\${ev.chkMonth}','\${ev.tid}')"><div class="sc-det-body"><div class="sc-det-text" style="\${ev.done?'text-decoration:line-through;opacity:.45':''}">\${ev.text}</div><div class="sc-det-lbl" style="color:\${C.dot}">\${C.label}</div></div></label></div>\`;
      } else {
        const timeBadge = ev.time ? \`<span style="font-size:10px;font-weight:700;color:#fff;background:#2563eb;border-radius:3px;padding:1px 5px;margin-right:5px;flex-shrink:0">\${ev.time}</span>\` : '';
        h += \`<div class="sc-det-ev"><span class="sc-det-dot" style="background:\${C.dot}"></span><div class="sc-det-body"><div class="sc-det-text">\${timeBadge}\${ev.text}</div><div class="sc-det-lbl" style="color:\${C.dot}">\${C.label}</div></div></div>\`;
      }
    });
  }
  el.innerHTML = h;
}

function renderSedeChkList(mo) {
  const el = document.getElementById('sedeChkList');
  if (!el) return;
  const month = \`2026-\${String(mo).padStart(2,'0')}\`;
  const mesNome = _SEDE_MESES[mo-1];
  const st = _sedeGetChkState(month);
  const lastDay = _sedeDaysInMonth(mo);
  let h = '';
  let totalItems = 0, doneItems = 0;

  SEDE_CHECKLIST.forEach(sec => {
    const secDay = sec.day === -1 ? lastDay : sec.day;
    h += \`<div class="sc-sect-label">\${sec.section}</div>\`;
    sec.items.forEach(item => {
      totalItems++;
      const done = !!st[item.id];
      if (done) doneItems++;
      h += \`<label class="sc-chk-item"><input type="checkbox" \${done?'checked':''} onchange="toggleSedeCTask('\${month}','\${item.id}')"><span class="\${done?'sc-chk-done':''}">\${item.text}</span></label>\`;
    });
  });

  const pct = totalItems ? Math.round(doneItems/totalItems*100) : 0;
  document.querySelector('#sedeChkPanel .sc-panel-hdr').innerHTML =
    \`✅ Checklist — \${mesNome} <span style="font-size:.7rem;font-weight:400;color:var(--g5);margin-left:6px">\${doneItems}/\${totalItems} · \${pct}%</span>\`;
  el.innerHTML = h;
}

// ── Init calendário ──
renderSedeCalendar();
`;

// Inject at LAST </script>
const lastClose = html.lastIndexOf('</script>');
if (lastClose < 0) { console.error('Não encontrou </script>'); process.exit(1); }
html = html.slice(0, lastClose) + calJS + '\n</script>' + html.slice(lastClose + '</script>'.length);
console.log('JS do calendário injetado.');

// ─── Verify ───
console.log('\n=== VERIFICAÇÃO ===');
console.log('sedeCalGrid HTML:', html.includes('sedeCalGrid'));
console.log('SEDE_CAL_SEED JS:', html.includes('SEDE_CAL_SEED'));
console.log('SEDE_CHECKLIST JS:', html.includes('SEDE_CHECKLIST'));
console.log('CSS sc-wrap:', html.includes('.sc-wrap'));
console.log('dashMovs mantido (oculto):', html.includes('id="dashMovs"'));
console.log('Tamanho HTML:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Salvo.');

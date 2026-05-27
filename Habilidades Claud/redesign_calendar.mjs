import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── 1. Atualizar CSS do calendário para layout idêntico ao CRM ───
const oldCalCSS = `/* ── CALENDÁRIO SEDE ── */
.sc-wrap{display:grid;grid-template-columns:1fr 290px;gap:12px;align-items:start;margin-bottom:16px}
.sc-tabs{display:flex;gap:3px;flex-wrap:wrap;margin-bottom:10px}
.sc-tab{padding:3px 10px;border-radius:12px;border:1px solid var(--border);background:var(--card);font-size:.72rem;cursor:pointer;color:var(--txt2);transition:all .12s;font-weight:500}
.sc-tab.active{background:var(--acc);color:#fff;border-color:var(--acc)}
.sc-cal-box{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.sc-cal{width:100%;border-collapse:collapse}
.sc-dow{background:var(--acc);color:rgba(255,255,255,.8);font-size:.65rem;font-weight:600;text-align:center;padding:6px 2px;text-transform:uppercase;letter-spacing:.3px}
.sc-day{vertical-align:top;border:1px solid var(--border);cursor:pointer;transition:background .1s;width:14.28%}
.sc-day:hover{background:var(--acc2)}
.sc-day.other{background:var(--card2);opacity:.5}
.sc-day.today .sc-dn{background:var(--acc);color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:11px}
.sc-day.selected{background:var(--acc2);box-shadow:inset 0 0 0 2px var(--acc)}
.sc-day-inner{height:100px;padding:5px;display:flex;flex-direction:column;gap:2px;overflow:hidden}
.sc-dn{font-size:12px;font-weight:700;color:var(--txt2);margin-bottom:1px;line-height:1;flex-shrink:0}
.sc-ev{font-size:10px;border-radius:3px;padding:2px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;line-height:1.4;cursor:pointer}
.sc-ev.cat-gremio{background:rgba(26,58,107,.14);color:#0f2647}
.sc-ev.cat-selecao{background:rgba(0,156,0,.12);color:#065f46}
.sc-ev.cat-financeiro{background:rgba(217,119,6,.12);color:#92400e}
.sc-ev.cat-outros{background:rgba(100,116,139,.1);color:#475569}
.sc-chk-pill{font-size:10px;border-radius:3px;padding:2px 5px;font-weight:600;display:flex;align-items:center;gap:3px;overflow:hidden;line-height:1.4}
.sc-chk-bar{flex:1;height:3px;border-radius:2px;background:rgba(0,0,0,.12);overflow:hidden;min-width:12px}
.sc-chk-fill{height:100%;border-radius:2px;transition:width .2s}
.sc-more{font-size:9px;color:var(--txt2);text-align:center;padding:1px 4px;background:var(--card2);border-radius:3px;cursor:pointer;margin-top:auto}
.sc-legend{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
.sc-leg-item{font-size:11px;color:var(--txt2);display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:10px;border:1px solid var(--border);background:var(--card)}
.sc-leg-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.sc-panel{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:10px}
.sc-panel-hdr{font-size:.78rem;font-weight:600;color:var(--txt);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border)}
.sc-det-empty{font-size:.75rem;color:var(--txt2);text-align:center;padding:10px 0;font-style:italic}
.sc-det-day{font-size:.82rem;font-weight:700;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border)}
.sc-det-ev{display:flex;align-items:flex-start;gap:7px;padding:7px 0;border-bottom:1px solid var(--border)}
.sc-det-ev:last-child{border-bottom:none}
.sc-det-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px}
.sc-det-body{flex:1;min-width:0}
.sc-det-text{font-size:.78rem;color:var(--txt);line-height:1.4}
.sc-det-lbl{font-size:.67rem;font-weight:600;margin-top:1px;letter-spacing:.2px}
.sc-chk-item{display:flex;align-items:flex-start;gap:7px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.77rem;color:var(--txt);line-height:1.4;cursor:pointer}
.sc-chk-item:last-child{border-bottom:none}
.sc-chk-item input{margin-top:2px;flex-shrink:0;accent-color:var(--acc);width:14px;height:14px;cursor:pointer}
.sc-chk-done{text-decoration:line-through;opacity:.45}
.sc-sect-label{font-size:.68rem;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.4px;margin:8px 0 3px;padding-top:4px;border-top:1px solid var(--border)}
.sc-sect-label:first-child{border-top:none;margin-top:0;padding-top:0}`;

const newCalCSS = `/* ── CALENDÁRIO SEDE — layout CRM ── */
/* Tabs do mês — estilo CRM */
.sc-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.sc-tab{padding:5px 14px;border:1px solid var(--border);border-radius:20px;background:var(--card);color:var(--txt2);font-size:12px;font-weight:600;cursor:pointer;transition:all .12s}
.sc-tab.active{background:var(--acc);color:#fff;border-color:var(--acc)}
/* Wrap vertical (igual CRM cal-wrap) */
.sc-cal-wrap{display:flex;flex-direction:column;gap:0;min-width:0;width:100%}
/* Grade */
.sc-cal-box{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:16px}
.sc-cal{width:100%;table-layout:fixed;border-collapse:collapse}
.sc-dow{background:var(--acc);color:rgba(255,255,255,.85);font-size:.65rem;font-weight:700;text-align:center;padding:8px 2px;text-transform:uppercase;letter-spacing:.3px;border:1px solid rgba(255,255,255,.15)}
.sc-day{vertical-align:top;border:1px solid var(--border);cursor:pointer;transition:background .12s;width:14.28%}
.sc-day:hover{background:var(--acc2)}
.sc-day.other{background:#f8fafc;opacity:.55}
.sc-day.today{background:rgba(26,58,107,.06);box-shadow:inset 0 0 0 2px var(--acc)}
.sc-day.today .sc-dn{background:var(--acc);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:12px}
.sc-day.selected{background:rgba(26,58,107,.07)!important;box-shadow:inset 0 0 0 2px var(--acc)}
.sc-day-inner{height:130px;overflow:hidden;padding:8px;display:flex;flex-direction:column;gap:3px}
.sc-dn{font-size:13px;font-weight:700;color:var(--txt2);line-height:1;margin-bottom:2px;flex-shrink:0}
.sc-ev{font-size:11px;border-radius:4px;padding:3px 6px;line-height:1.4;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
.sc-ev.cat-gremio{background:rgba(26,58,107,.14);color:#0f2647}
.sc-ev.cat-selecao{background:rgba(0,156,0,.12);color:#065f46}
.sc-ev.cat-financeiro{background:rgba(217,119,6,.12);color:#92400e}
.sc-ev.cat-outros{background:rgba(100,116,139,.1);color:#475569}
.sc-chk-pill{font-size:10px;border-radius:4px;padding:2px 6px;line-height:1.4;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:4px;overflow:hidden}
.sc-chk-bar{flex:1;height:3px;border-radius:2px;background:rgba(0,0,0,.12);overflow:hidden;min-width:20px}
.sc-chk-fill{height:100%;border-radius:2px;transition:width .2s}
.sc-more{font-size:9px;color:var(--txt2);padding:1px 5px;text-align:center;cursor:pointer;border-radius:4px;background:var(--card2);border:1px solid var(--border);margin-top:auto}
.sc-more:hover{background:var(--border)}
/* Linha inferior: detalhe + painel lateral */
.sc-bottom{display:flex;gap:16px;align-items:flex-start}
.sc-detail-card{flex:1;min-width:0}
.sc-right-panel{width:270px;flex-shrink:0}
/* Cards laterais */
.sc-sidebar-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:12px}
.sc-sidebar-title{font-size:12px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
/* Legenda */
.sc-legend{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.sc-leg-item{font-size:11px;color:var(--txt2);display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:10px;border:1px solid var(--border);background:var(--card)}
.sc-leg-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
/* Checklist */
.sc-panel-hdr{font-size:.78rem;font-weight:600;color:var(--txt);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);margin-top:14px;padding-top:12px;border-top:1px solid var(--border)}
/* Detalhe do dia */
.sc-det-empty{font-size:12px;color:var(--txt2);text-align:center;padding:14px 0;font-style:italic}
.sc-det-day{font-size:14px;font-weight:700;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border);color:var(--txt)}
.sc-det-ev{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)}
.sc-det-ev:last-child{border-bottom:none}
.sc-det-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px}
.sc-det-body{flex:1;min-width:0}
.sc-det-text{font-size:12px;color:var(--txt);line-height:1.4;word-break:break-word}
.sc-det-lbl{font-size:10px;font-weight:600;margin-top:2px;letter-spacing:.2px}
.sc-chk-item{display:flex;align-items:flex-start;gap:7px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.77rem;color:var(--txt);line-height:1.4;cursor:pointer}
.sc-chk-item:last-child{border-bottom:none}
.sc-chk-item input{margin-top:2px;flex-shrink:0;accent-color:var(--acc);width:14px;height:14px;cursor:pointer}
.sc-chk-done{text-decoration:line-through;opacity:.45}
.sc-sect-label{font-size:.68rem;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.4px;margin:8px 0 3px;padding-top:4px;border-top:1px solid var(--border)}
.sc-sect-label:first-child{border-top:none;margin-top:0;padding-top:0}`;

if (!html.includes(oldCalCSS)) {
  console.error('ERRO: bloco CSS do calendário não encontrado!');
  process.exit(1);
}
html = html.replace(oldCalCSS, newCalCSS);
console.log('1. CSS do calendário atualizado para layout CRM.');

// ─── 2. Atualizar HTML da aba calendário ───
const oldCalHTML = `<div id="tab-calendario" class="page">
  <div class="sh">
    <h2>Calendário</h2>
    <div id="sedeCalTabs" class="sc-tabs" style="margin-bottom:0"></div>
  </div>
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
</div>`;

const newCalHTML = `<div id="tab-calendario" class="page">
  <div class="page-hdr">
    <div class="page-title">📅 Calendário 2026</div>
  </div>
  <div class="sc-tabs" id="sedeCalTabs"></div>
  <div class="sc-cal-box">
    <table id="sedeCalGrid" class="sc-cal"></table>
  </div>
  <div class="sc-bottom">
    <div class="sc-sidebar-card sc-detail-card" id="sedeCalDetail">
      <div class="sc-det-empty">Clique em um dia para ver os eventos</div>
    </div>
    <div class="sc-right-panel">
      <div class="sc-sidebar-card">
        <div class="sc-sidebar-title">Categorias</div>
        <div id="sedeCalLegend" class="sc-legend"></div>
      </div>
      <div class="sc-sidebar-card" id="sedeChkPanel">
        <div class="sc-sidebar-title">✅ Checklist do Mês</div>
        <div id="sedeChkList"><div class="sc-det-empty">Carregando…</div></div>
      </div>
    </div>
  </div>
</div>`;

if (!html.includes(oldCalHTML)) {
  console.error('ERRO: HTML da aba calendário não encontrado!');
  process.exit(1);
}
html = html.replace(oldCalHTML, newCalHTML);
console.log('2. HTML da aba calendário reestruturado.');

// ─── 3. Ajustar renderSedeChkList para o novo container (sc-sidebar-title em vez de sc-panel-hdr) ───
// A função atualiza '#sedeChkPanel .sc-panel-hdr' — precisamos mudar para '.sc-sidebar-title'
html = html.replace(
  `document.querySelector('#sedeChkPanel .sc-panel-hdr').innerHTML =
    \`✅ Checklist — \${mesNome} <span style="font-size:.7rem;font-weight:400;color:var(--txt2);margin-left:6px">\${doneItems}/\${totalItems} · \${pct}%</span>\`;`,
  `document.querySelector('#sedeChkPanel .sc-sidebar-title').innerHTML =
    \`✅ Checklist — \${mesNome} <span style="font-size:.7rem;font-weight:400;color:var(--txt2);margin-left:6px">\${doneItems}/\${totalItems} · \${pct}%</span>\`;`
);
console.log('3. renderSedeChkList: seletor atualizado para sc-sidebar-title.');

// ─── 4. Atualizar responsivo ───
html = html.replace(
  `.sc-wrap{grid-template-columns:1fr}`,
  `.sc-bottom{flex-direction:column}.sc-right-panel{width:100%}`
);
console.log('4. CSS responsivo atualizado.');

// ─── Verificação final ───
console.log('\n=== VERIFICAÇÃO ===');
console.log('sc-cal-box + sc-bottom no HTML:', html.includes('sc-cal-box') && html.includes('sc-bottom'));
console.log('sc-detail-card:', html.includes('sc-detail-card'));
console.log('sc-right-panel:', html.includes('sc-right-panel'));
console.log('sc-sidebar-card:', html.includes('sc-sidebar-card'));
console.log('sc-sidebar-title:', html.includes('sc-sidebar-title'));
console.log('sc-day-inner 130px:', html.includes('height:130px'));
console.log('Tamanho HTML:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Salvo.');

import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── 1. Substituir bloco Calendário no Dashboard por Pendências ───
const oldCalBlock = `  <!-- CALENDÁRIO & CHECKLIST -->
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

const newDashPendencias = `  <!-- PENDÊNCIAS DO MÊS -->
  <div class="sh" style="margin-top:2px"><h2 id="dashPendenciasTitle">✅ Pendências do Mês</h2></div>
  <div id="dashPendencias" style="background:#fff;border-radius:var(--r);box-shadow:0 1px 3px rgba(0,0,0,.08);padding:14px 16px;margin-bottom:14px">
    <div class="empty">Carregando...</div>
  </div>
  <table id="dashMovs" style="display:none"><tbody></tbody></table>`;

if (!html.includes(oldCalBlock)) {
  console.error('ERRO: bloco do calendário no dashboard não encontrado!');
  process.exit(1);
}
html = html.replace(oldCalBlock, newDashPendencias);
console.log('1. Dashboard: calendário → pendências.');

// ─── 2. Adicionar aba Calendário no nav ───
html = html.replace(
  `<button class="active" onclick="showTab('dashboard')">Dashboard</button>
  <button onclick="showTab('jogos')">Jogos</button>`,
  `<button class="active" onclick="showTab('dashboard')">Dashboard</button>
  <button onclick="showTab('calendario')">Calendário</button>
  <button onclick="showTab('jogos')">Jogos</button>`
);
console.log('2. Nav: aba Calendário adicionada.');

// ─── 3. Adicionar tab-calendario logo após tab-dashboard ───
const afterDashboard = `</div>

<!-- JOGOS -->`;

const calTabHTML = `</div>

<!-- CALENDÁRIO -->
<div id="tab-calendario" class="tab-content">
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
</div>

<!-- JOGOS -->`;

html = html.replace(afterDashboard, calTabHTML);
console.log('3. Tab Calendário adicionada ao HTML.');

// ─── 4. Registrar calendario em TAB_RENDERERS ───
html = html.replace(
  `const TAB_RENDERERS={
  dashboard:renderDash,jogos:renderJogos,mensalidades:renderMensalidades,
  resumo:renderResumo,comandas:renderComandas,bar:renderContaBar,
  holding:renderContaHolding,membros:renderMembros
};`,
  `const TAB_RENDERERS={
  dashboard:renderDash,calendario:renderSedeCalendar,jogos:renderJogos,
  mensalidades:renderMensalidades,resumo:renderResumo,comandas:renderComandas,
  bar:renderContaBar,holding:renderContaHolding,membros:renderMembros
};`
);
console.log('4. TAB_RENDERERS atualizado.');

// ─── 5. Atualizar renderDash para incluir pendências ───
// Encontrar o fim da função renderDash (antes do próximo // ─── comentário)
const renderDashEnd = `  const ultimas=[...DB.extratoBar].sort((a,b)=>b.data.localeCompare(a.data)||b.hora.localeCompare(a.hora||'')).slice(0,10);
  document.querySelector('#dashMovs tbody').innerHTML=ultimas.length
    ?ultimas.map(t=>\`<tr>
        <td>\${fmtD(t.data)}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${t.nome}</td>
        <td><span class="chip">\${CATS_BAR[t.cat]||t.cat}</span></td>
        <td class="tr bold green">\${t.dir==='entrada'?brl(t.valor):''}</td>
        <td class="tr bold red">\${t.dir==='saida'?brl(t.valor):''}</td>
      </tr>\`).join('')
    :'<tr><td colspan="5" class="empty">Nenhuma movimentação importada ainda.</td></tr>';
}`;

const renderDashEndNew = `  // ── Pendências do checklist ──
  renderSedeDashPendencias();
}`;

if (!html.includes(renderDashEnd)) {
  console.error('ERRO: fim de renderDash não encontrado!');
  process.exit(1);
}
html = html.replace(renderDashEnd, renderDashEndNew);
console.log('5. renderDash: movimentações removidas, pendências adicionadas.');

// ─── 6. Adicionar função renderSedeDashPendencias e remover init auto de renderSedeCalendar ───
const lastClose = html.lastIndexOf('</script>');
const dashPendFn = `
// ── Pendências do mês no Dashboard ──
function renderSedeDashPendencias() {
  const el = document.getElementById('dashPendencias');
  const titleEl = document.getElementById('dashPendenciasTitle');
  if (!el) return;
  const mo = new Date().getMonth() + 1;
  const month = '2026-' + String(mo).padStart(2,'0');
  const mesNome = _SEDE_MESES[mo-1];
  const st = _sedeGetChkState(month);
  const lastDay = _sedeDaysInMonth(mo);

  let pendentes = [];
  let total = 0;
  SEDE_CHECKLIST.forEach(sec => {
    const secDay = sec.day === -1 ? lastDay : sec.day;
    sec.items.forEach(item => {
      total++;
      const done = !!st[item.id];
      pendentes.push({ ...item, done, section: sec.section, day: secDay });
    });
  });
  const feitos = pendentes.filter(i => i.done).length;
  const pct = Math.round(feitos / total * 100);
  const restantes = pendentes.filter(i => !i.done);

  if (titleEl) titleEl.innerHTML = \`✅ Pendências — \${mesNome} <span style="font-size:.75rem;font-weight:400;color:var(--g5);margin-left:6px">\${feitos}/\${total} concluídas · \${pct}%</span>\`;

  if (!restantes.length) {
    el.innerHTML = '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;color:#16a34a;font-size:.84rem;font-weight:500">🎉 Todas as pendências do mês foram concluídas!</div>';
    return;
  }

  // Progress bar
  let h = \`<div style="background:var(--g2);border-radius:4px;height:6px;margin-bottom:14px;overflow:hidden"><div style="height:100%;background:#3b82f6;border-radius:4px;width:\${pct}%;transition:width .3s"></div></div>\`;

  // Group remaining by section
  const bySec = {};
  restantes.forEach(item => {
    if (!bySec[item.section]) bySec[item.section] = [];
    bySec[item.section].push(item);
  });

  Object.entries(bySec).forEach(([sec, items]) => {
    h += \`<div style="font-size:.68rem;font-weight:700;color:var(--g5);text-transform:uppercase;letter-spacing:.4px;margin:10px 0 4px;padding-top:8px;border-top:1px solid var(--g2)">\${sec}</div>\`;
    items.forEach(item => {
      h += \`<label style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--g2);cursor:pointer;font-size:.81rem;color:var(--g7);line-height:1.4">
        <input type="checkbox" style="margin-top:2px;flex-shrink:0;accent-color:#3b82f6;width:14px;height:14px;cursor:pointer" onchange="toggleSedeCTask('\${month}','\${item.id}');renderDash()">
        \${item.text}
      </label>\`;
    });
  });

  el.innerHTML = h;
}
`;

html = html.slice(0, lastClose) + dashPendFn + '\n</script>' + html.slice(lastClose + '</script>'.length);
console.log('6. renderSedeDashPendencias adicionada.');

// ─── 7. Remover chamada automática renderSedeCalendar() no init ───
// (ela agora é chamada só ao abrir a aba)
html = html.replace(
  `// ── Init calendário ──
renderSedeCalendar();`,
  `// ── Init calendário (chamado ao abrir a aba Calendário) ──
// renderSedeCalendar é chamado via TAB_RENDERERS quando a aba é aberta`
);
console.log('7. Init automático do calendário removido.');

// ─── Verificação final ───
console.log('\n=== VERIFICAÇÃO FINAL ===');
console.log('Tab Calendário HTML:', html.includes('id="tab-calendario"'));
console.log('Nav Calendário:', html.includes("showTab('calendario')"));
console.log('TAB_RENDERERS calendario:', html.includes('calendario:renderSedeCalendar'));
console.log('dashPendencias:', html.includes('id="dashPendencias"'));
console.log('renderSedeDashPendencias fn:', html.includes('function renderSedeDashPendencias'));
console.log('Tamanho:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Salvo.');

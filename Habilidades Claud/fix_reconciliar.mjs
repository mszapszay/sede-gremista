import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── Remove the misplaced injection (if it happened in a CDN script tag) ───
// Find all <script src="..."> blocks and clean any injected content from them
html = html.replace(/(<script\s+src="[^"]*">)([\s\S]*?)(<\/script>)/g, (match, open, content, close) => {
  if (content.trim()) {
    console.log('Cleaning CDN script tag of', content.length, 'chars of content');
    return open + close;
  }
  return match;
});

// ─── Check current state ───
const lines = html.split('\n');
const mainScriptLine = lines.findIndex(l => l.trim() === '<script>');
const lastScriptCloseLine = [...lines.entries()].filter(([,l]) => l.includes('</script>')).pop()?.[0];
console.log('Main <script> at line:', mainScriptLine + 1);
console.log('Last </script> at line:', (lastScriptCloseLine || 0) + 1);

// Check if modal is already there (from previous attempt)
const hasModal = html.includes('id="mReconciliar"');
const hasButton = html.includes('Reconciliar Holding');
const hasFn = html.includes('function reconciliarMensalidades');
console.log('Has modal:', hasModal, '| Has button:', hasButton, '| Has fn:', hasFn);

// ─── If functions were misplaced, remove them ───
if (hasFn) {
  const marker = '// ─── RECONCILIAR MENSALIDADES DA HOLDING ───';
  const fnStart = html.indexOf(marker);
  if (fnStart >= 0) {
    // Check if it's inside main script
    const fnLine = html.slice(0, fnStart).split('\n').length;
    if (fnLine < mainScriptLine || fnLine > (lastScriptCloseLine || 0)) {
      console.log('Removing misplaced reconciliation functions from line', fnLine);
      // Remove from marker to the next function or until we hit a proper boundary
      // Find the end: last closing } before next major function or </script>
      const fnEnd = html.indexOf('\n</script>', fnStart);
      if (fnEnd > 0) {
        html = html.slice(0, fnStart) + html.slice(fnEnd);
        console.log('Removed misplaced block');
      }
    }
  }
}

// ─── JS functions to inject ───
const reconcFn = `
// ─── RECONCILIAR MENSALIDADES DA HOLDING ───
let _reconcPendente = null;

function normNomeRec(n) {
  return (n||'').normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/\s+\d{5,}\s*/g,' ').toLowerCase().trim().replace(/\s+/g,' ');
}

function addMesesRec(base, n) {
  const result = [];
  const [ano, mes] = base.split('-').map(Number);
  for (let i = 0; i < n; i++) {
    let m = mes - i, a = ano;
    while (m <= 0) { m += 12; a--; }
    const s = a + '-' + String(m).padStart(2,'0');
    if (s >= '2026-01') result.push(s);
  }
  return result;
}

function reconciliarMensalidades() {
  if (!IS_ADMIN) return;
  if (!DB.extratoHolding || !DB.extratoHolding.length) {
    alert('Importe o extrato da Holding antes.'); return;
  }
  const TAXA = 30;
  const SKIP = /wise.*brasil|corretora.*cambio|transportes.*logistica|\\bvtn\\b/i;
  const mens = DB.extratoHolding.filter(t =>
    t.cat === 'mensalidade' && t.dir === 'entrada' && t.valor >= 15 && !SKIP.test(t.desc||'')
  );
  if (!mens.length) { alert('Nenhum pagamento de mensalidade encontrado.'); return; }

  const byNorm = {};
  mens.forEach(t => {
    const norm = normNomeRec(t.desc||'');
    if (!byNorm[norm]) byNorm[norm] = { nomeDisplay: t.desc, pagamentos: [] };
    if (/[a-z]/.test(t.desc||'')) byNorm[norm].nomeDisplay = t.desc;
    byNorm[norm].pagamentos.push({ data: (t.data||'').slice(0,7), valor: t.valor });
  });

  const lista = [];
  for (const [norm, pessoa] of Object.entries(byNorm)) {
    const pags = pessoa.pagamentos.filter(p=>p.data).sort((a,b)=>a.data.localeCompare(b.data));
    if (!pags.length) continue;
    const totalPago = pags.reduce((s,p)=>s+p.valor, 0);
    const mesesSet = new Set();
    pags.forEach(p => {
      const n = Math.max(1, Math.round(p.valor / TAXA));
      addMesesRec(p.data, n).forEach(m => mesesSet.add(m));
    });
    const meses = [...mesesSet].sort();
    if (!meses.length) continue;
    const membro = DB.membros.find(m => normNomeRec(m.nome) === norm);
    lista.push({ norm, nomeDisplay: pessoa.nomeDisplay,
      membroId: membro ? membro.id : null, membroNome: membro ? membro.nome : '',
      meses, totalPago, nPagamentos: pags.length, isNew: !membro });
  }
  lista.sort((a,b) => b.meses.length - a.meses.length || b.totalPago - a.totalPago);
  _reconcPendente = lista;

  const novos = lista.filter(r=>r.isNew).length;
  const totalMeses = lista.reduce((s,r)=>s+r.meses.length, 0);
  document.getElementById('reconcResumo').innerHTML =
    '<strong>' + lista.length + ' pagadores</strong> · ' + novos + ' novos membros · ' +
    totalMeses + ' meses a marcar no total';
  document.getElementById('reconcTbody').innerHTML = lista.map(r => {
    const mStr = r.meses.map(m=>m.replace('2026-','')).join(' ');
    const badge = r.isNew ? '<span class="badge bg-yellow">Novo</span>'
      : '<span class="badge bg-green">'+r.membroNome.split(' ')[0]+'</span>';
    return '<tr><td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+r.nomeDisplay+'</td>'+
      '<td style="text-align:right">'+r.nPagamentos+'</td>'+
      '<td style="text-align:right">R$ '+r.totalPago.toFixed(0)+'</td>'+
      '<td style="font-size:.72rem">'+mStr+'</td><td>'+badge+'</td></tr>';
  }).join('');
  abrirModal('mReconciliar');
}

function confirmarReconciliar() {
  if (!_reconcPendente || !IS_ADMIN) return;
  let criados = 0, mesesMarcados = 0;
  _reconcPendente.forEach(r => {
    let mbId = r.membroId;
    if (!mbId) {
      mbId = uid();
      DB.membros.push({ id: mbId, nome: r.nomeDisplay, status: 'ativo', desde: r.meses[0]||'' });
      if (!DB.mensalidades[mbId]) DB.mensalidades[mbId] = {};
      criados++;
    }
    if (!DB.mensalidades[mbId]) DB.mensalidades[mbId] = {};
    r.meses.forEach(mes => {
      if (!DB.mensalidades[mbId][mes]) { DB.mensalidades[mbId][mes]='pago'; mesesMarcados++; }
    });
  });
  salvarDB(); fecharModal('mReconciliar'); _reconcPendente = null;
  renderMensalidades(); atualizarHeader();
  alert('\\u2713 '+criados+' membros criados \\u00b7 '+mesesMarcados+' meses marcados!');
}
`;

// ─── Inject at LAST </script> ───
const lastClose = html.lastIndexOf('</script>');
html = html.slice(0, lastClose) + reconcFn + '\n</script>' + html.slice(lastClose + '</script>'.length);

// ─── Add modal if not present ───
if (!html.includes('id="mReconciliar"')) {
  const reconcModal = `
<!-- MODAL RECONCILIAR MENSALIDADES -->
<div id="mReconciliar" class="mover">
  <div class="modal" style="max-width:820px">
    <h3>⚡ Reconciliar Mensalidades da Holding</h3>
    <div class="info" id="reconcResumo" style="margin-bottom:8px"></div>
    <p style="font-size:.77rem;color:#6b7280;margin-bottom:10px">
      Pagamentos na Conta Holding como mensalidade. Meses calculados: R$30=1 mês, R$60=2 meses, etc. (retroativo).
    </p>
    <div class="tw" style="max-height:380px;overflow-y:auto">
      <table><thead><tr>
        <th>Pagador</th><th style="text-align:right">Pgtos</th><th style="text-align:right">Total</th>
        <th>Meses marcados</th><th>Membro</th>
      </tr></thead><tbody id="reconcTbody"></tbody></table>
    </div>
    <div class="mactions" style="margin-top:14px">
      <button class="btn btn-ghost" onclick="fecharModal('mReconciliar')">Cancelar</button>
      <button class="btn btn-success" onclick="confirmarReconciliar()">✓ Confirmar e marcar meses</button>
    </div>
  </div>
</div>`;
  html = html.replace('</body>', reconcModal + '\n</body>');
  console.log('Modal added');
}

// ─── Add button if not present ───
if (!html.includes('Reconciliar Holding')) {
  html = html.replace(
    '<button class="btn btn-ghost" onclick="exportarMensalidades()">⬇ Excel</button>',
    '<button class="btn btn-ghost" onclick="exportarMensalidades()">⬇ Excel</button>\n<button class="btn btn-primary btn-sm admin-only" onclick="reconciliarMensalidades()" style="background:#7c3aed">⚡ Reconciliar Holding</button>'
  );
  console.log('Button added');
}

// ─── Final verification ───
const lines2 = html.split('\n');
const mainSc = lines2.findIndex(l => l.trim() === '<script>');
const lastSc = [...lines2.entries()].filter(([,l])=>l.includes('</script>')).pop()?.[0];
const fn1 = lines2.findIndex(l => l.includes('function reconciliarMensalidades'));
const fn2 = lines2.findIndex(l => l.includes('function confirmarReconciliar'));
console.log('\n=== FINAL CHECK ===');
console.log('Main <script>:', mainSc+1, '| Last </script>:', (lastSc||0)+1);
console.log('reconciliarMensalidades at line:', fn1+1, '→ inside?', fn1>mainSc && fn1<(lastSc||0));
console.log('confirmarReconciliar at line:', fn2+1, '→ inside?', fn2>mainSc && fn2<(lastSc||0));
console.log('Has modal:', html.includes('id="mReconciliar"'));
console.log('Has button:', html.includes('Reconciliar Holding'));
console.log('HTML size:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Saved.');

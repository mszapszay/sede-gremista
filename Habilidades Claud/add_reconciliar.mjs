import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── 1. Add button to Mensalidades tab ───
html = html.replace(
  '<button class="btn btn-ghost" onclick="exportarMensalidades()">⬇ Excel</button>',
  '<button class="btn btn-ghost" onclick="exportarMensalidades()">⬇ Excel</button>\n<button class="btn btn-primary btn-sm admin-only" onclick="reconciliarMensalidades()" style="background:#7c3aed">⚡ Reconciliar Holding</button>'
);

// ─── 2. Add reconciliation modal (before closing </body>) ───
const reconcModal = `
<!-- MODAL RECONCILIAR MENSALIDADES -->
<div id="mReconciliar" class="mover">
  <div class="modal" style="max-width:820px">
    <h3>⚡ Reconciliar Mensalidades da Holding</h3>
    <div class="info" id="reconcResumo" style="margin-bottom:8px"></div>
    <p style="font-size:.77rem;color:#6b7280;margin-bottom:10px">
      Pagamentos recebidos na Conta Holding como mensalidade. Meses calculados: R$30 = 1 mês, R$60 = 2 meses, etc.
      Membros novos serão criados automaticamente.
    </p>
    <div class="tw" style="max-height:380px;overflow-y:auto">
      <table>
        <thead><tr>
          <th>Pagador</th><th style="text-align:right">Pgtos</th><th style="text-align:right">Total</th>
          <th>Meses a marcar</th><th>Membro</th>
        </tr></thead>
        <tbody id="reconcTbody"></tbody>
      </table>
    </div>
    <div class="mactions" style="margin-top:14px">
      <button class="btn btn-ghost" onclick="fecharModal('mReconciliar')">Cancelar</button>
      <button class="btn btn-success" onclick="confirmarReconciliar()">✓ Confirmar e marcar meses</button>
    </div>
  </div>
</div>`;

html = html.replace('</body>', reconcModal + '\n</body>');

// ─── 3. Add reconciliation JS functions (before closing </script>) ───
const reconcFn = `
// ─── RECONCILIAR MENSALIDADES DA HOLDING ───
let _reconcPendente = null;

function normNomeReconciliar(n) {
  return (n||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'')
    .replace(/\\s+\\d{5,}\\s*/g,' ')  // remove CPF inline
    .toLowerCase().trim().replace(/\\s+/g,' ');
}

function addMeses(base, n) {
  // Returns array of YYYY-MM strings: base month and (n-1) months before
  const result = [];
  const [ano, mes] = base.split('-').map(Number);
  for (let i = 0; i < n; i++) {
    let m = mes - i, a = ano;
    while (m <= 0) { m += 12; a--; }
    const s = a + '-' + String(m).padStart(2,'0');
    if (s >= '2026-01') result.push(s); // only track 2026+
  }
  return result;
}

function reconciliarMensalidades() {
  if (!IS_ADMIN) return;
  if (!DB.extratoHolding || !DB.extratoHolding.length) {
    alert('Importe o extrato da Holding antes.'); return;
  }

  const TAXA = 30;
  const SKIP = /wise.*brasil|corretora.*cambio|transportes.*logistica|vtn\\s/i;

  // Filter mensalidade entries with meaningful value
  const mens = DB.extratoHolding.filter(t =>
    t.cat === 'mensalidade' && t.dir === 'entrada' && t.valor >= 15 && !SKIP.test(t.desc)
  );
  if (!mens.length) { alert('Nenhum pagamento de mensalidade encontrado na Holding.'); return; }

  // Group by normalized name
  const byNorm = {};
  mens.forEach(t => {
    const norm = normNomeReconciliar(t.desc);
    if (!byNorm[norm]) byNorm[norm] = { nomeDisplay: t.desc, pagamentos: [] };
    if (/[a-z]/.test(t.desc)) byNorm[norm].nomeDisplay = t.desc; // prefer mixed case
    byNorm[norm].pagamentos.push({ data: t.data.slice(0,7), valor: t.valor });
  });

  // Build reconciliation list
  const lista = [];
  for (const [norm, pessoa] of Object.entries(byNorm)) {
    const pags = pessoa.pagamentos.sort((a,b) => a.data.localeCompare(b.data));
    const totalPago = pags.reduce((s,p) => s+p.valor, 0);

    // Calculate months (retroactive: payment in month M covers M and M-1, M-2...)
    const mesesSet = new Set();
    pags.forEach(p => {
      const n = Math.max(1, Math.round(p.valor / TAXA));
      addMeses(p.data, n).forEach(m => mesesSet.add(m));
    });
    const meses = [...mesesSet].sort();
    if (!meses.length) continue;

    // Find matching member
    const membro = DB.membros.find(m => normNomeReconciliar(m.nome) === norm);

    lista.push({
      norm, nomeDisplay: pessoa.nomeDisplay,
      membroId: membro ? membro.id : null,
      membroNome: membro ? membro.nome : '',
      meses, totalPago,
      nPagamentos: pags.length,
      isNew: !membro
    });
  }

  // Sort by most months paid
  lista.sort((a,b) => b.meses.length - a.meses.length || b.totalPago - a.totalPago);
  _reconcPendente = lista;

  const novos = lista.filter(r => r.isNew).length;
  const existentes = lista.filter(r => !r.isNew).length;
  const totalMeses = lista.reduce((s,r) => s + r.meses.length, 0);

  document.getElementById('reconcResumo').innerHTML =
    '<strong>' + lista.length + ' pagadores</strong> · ' +
    novos + ' novos membros · ' + existentes + ' existentes · ' +
    totalMeses + ' meses a marcar';

  document.getElementById('reconcTbody').innerHTML = lista.map(r => {
    const mesesStr = r.meses.map(m => m.replace('2026-','')).join(' ');
    const badge = r.isNew
      ? '<span class="badge bg-yellow">Novo</span>'
      : '<span class="badge bg-green">' + r.membroNome.split(' ')[0] + '</span>';
    return '<tr><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">' + r.nomeDisplay + '</td>' +
      '<td style="text-align:right">' + r.nPagamentos + '</td>' +
      '<td style="text-align:right">R$ ' + r.totalPago.toFixed(0) + '</td>' +
      '<td style="font-size:.72rem;color:#374151">' + mesesStr + '</td>' +
      '<td>' + badge + '</td></tr>';
  }).join('');

  abrirModal('mReconciliar');
}

function confirmarReconciliar() {
  if (!_reconcPendente || !IS_ADMIN) return;
  let criados = 0, mesesMarcados = 0;

  _reconcPendente.forEach(r => {
    let membroId = r.membroId;

    if (!membroId) {
      // Create new member
      membroId = uid();
      const primeiroMes = r.meses[0] || '';
      DB.membros.push({ id: membroId, nome: r.nomeDisplay, status: 'ativo', desde: primeiroMes });
      if (!DB.mensalidades[membroId]) DB.mensalidades[membroId] = {};
      criados++;
    }

    if (!DB.mensalidades[membroId]) DB.mensalidades[membroId] = {};
    r.meses.forEach(mes => {
      if (!DB.mensalidades[membroId][mes]) {
        DB.mensalidades[membroId][mes] = 'pago';
        mesesMarcados++;
      }
    });
  });

  salvarDB();
  fecharModal('mReconciliar');
  _reconcPendente = null;
  renderMensalidades();
  atualizarHeader();
  alert('\\u2713 ' + criados + ' membros criados · ' + mesesMarcados + ' meses marcados como pagos!');
}
`;

html = html.replace('</script>', reconcFn + '\n</script>');

// Verify
console.log('Button added:', html.includes('reconciliarMensalidades()'));
console.log('Modal added:', html.includes('mReconciliar'));
console.log('Function added:', html.includes('function reconciliarMensalidades'));
console.log('HTML size:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Saved.');

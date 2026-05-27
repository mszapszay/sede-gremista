import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── Sanity check: clean any content from CDN script tags ───
html = html.replace(/(<script\s+src="[^"]*">)([\s\S]*?)(<\/script>)/g, (match, open, content, close) => {
  if (content.trim()) {
    console.log('Limpando tag CDN com', content.length, 'chars de conteúdo');
    return open + close;
  }
  return match;
});

// ─── Check if already injected ───
if (html.includes('BATUTA_DATA') || html.includes('importarDadosBatuta')) {
  console.log('BATUTA_DATA já existe no HTML — abortando para evitar duplicação.');
  process.exit(0);
}

// ─── Read compact JSON ───
const batutaJson = readFileSync('C:/Users/mauri/Downloads/batuta_compact.json', 'utf8');

// ─── Build the JS to inject ───
const batutaCode = `
// ─── DADOS DO BATUTA (planilha oficial de mensalidades) ───
const BATUTA_DATA = ${batutaJson};

function normNomeBatuta(n) {
  return (n||'').normalize('NFD').replace(/[̀-ͯ]/g,'')
    .toLowerCase().trim().replace(/\s+/g,' ');
}

function importarDadosBatuta() {
  if (!IS_ADMIN) return;
  const d = BATUTA_DATA;
  let criados = 0, atualizados = 0, mesesImportados = 0;

  d.members.forEach(bm => {
    const normBatuta = normNomeBatuta(bm.nome);
    // Try to find existing member by normalized name (also try apelido)
    let membro = DB.membros.find(m => normNomeBatuta(m.nome) === normBatuta)
                || DB.membros.find(m => normNomeBatuta(m.apelido||'') === normNomeBatuta(bm.apelido));

    let mbId;
    if (!membro) {
      // Create new member
      mbId = uid();
      const novoMembro = { id: mbId, nome: bm.nome, apelido: bm.apelido, status: bm.status };
      if (bm.desde) novoMembro.desde = bm.desde;
      DB.membros.push(novoMembro);
      if (!DB.mensalidades[mbId]) DB.mensalidades[mbId] = {};
      criados++;
    } else {
      mbId = membro.id;
      // Update apelido and status if missing
      if (!membro.apelido && bm.apelido) membro.apelido = bm.apelido;
      if (bm.status === 'isento_fixo') membro.status = 'isento_fixo';
      if (!membro.desde && bm.desde) membro.desde = bm.desde;
      if (!DB.mensalidades[mbId]) DB.mensalidades[mbId] = {};
      atualizados++;
    }

    // Import monthly statuses — Batuta is authoritative, overwrite existing
    const meses = d.mensalidades[bm.id] || {};
    Object.entries(meses).forEach(([mes, status]) => {
      DB.mensalidades[mbId][mes] = status;
      mesesImportados++;
    });
  });

  salvarDB();
  renderMensalidades();
  atualizarHeader();
  const btn = document.getElementById('btnImportBatuta');
  if (btn) { btn.textContent = '✓ Batuta importado'; btn.disabled = true; btn.style.background = '#9ca3af'; }
  alert('✓ Batuta importado!\\n' + criados + ' membros criados · ' + atualizados + ' atualizados · ' + mesesImportados + ' meses registrados.');
}
`;

// ─── Inject at LAST </script> ───
const lastClose = html.lastIndexOf('</script>');
if (lastClose < 0) { console.error('Não encontrou </script>'); process.exit(1); }
html = html.slice(0, lastClose) + batutaCode + '\n</script>' + html.slice(lastClose + '</script>'.length);
console.log('Código BATUTA_DATA injetado.');

// ─── Add button in Mensalidades tab ───
// Look for the Reconciliar Holding button (we'll add our button after it)
const reconcBtn = '<button class="btn btn-primary btn-sm admin-only" onclick="reconciliarMensalidades()" style="background:#7c3aed">⚡ Reconciliar Holding</button>';
const batatuBtn = '\n<button id="btnImportBatuta" class="btn btn-primary btn-sm admin-only" onclick="importarDadosBatuta()" style="background:#059669">📋 Importar Batuta</button>';

if (html.includes(reconcBtn)) {
  html = html.replace(reconcBtn, reconcBtn + batatuBtn);
  console.log('Botão Importar Batuta adicionado após Reconciliar Holding.');
} else {
  // Fallback: add after Excel button
  const excelBtn = '<button class="btn btn-ghost" onclick="exportarMensalidades()">⬇ Excel</button>';
  if (html.includes(excelBtn)) {
    html = html.replace(excelBtn, excelBtn + batatuBtn);
    console.log('Botão Importar Batuta adicionado após Excel (fallback).');
  } else {
    console.warn('Não encontrou ponto de ancoragem para o botão!');
  }
}

// ─── Final verification ───
console.log('\n=== VERIFICAÇÃO FINAL ===');
console.log('Tem BATUTA_DATA:', html.includes('BATUTA_DATA'));
console.log('Tem importarDadosBatuta:', html.includes('function importarDadosBatuta'));
console.log('Tem botão:', html.includes('btnImportBatuta'));
console.log('Tamanho HTML:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Salvo.');

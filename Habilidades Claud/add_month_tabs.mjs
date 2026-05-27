import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── Sanity check ───
html = html.replace(/(<script\s+src="[^"]*">)([\s\S]*?)(<\/script>)/g, (m, open, content, close) => {
  if (content.trim()) return open + close;
  return m;
});

if (html.includes('barMesAtivo') || html.includes('id="barMesTabs"')) {
  console.log('Abas de mês já existem — abortando.'); process.exit(0);
}

// ─── 1. Substituir <select> de filtro por div de tabs no HTML ───

// CONTA BAR: substituir a linha do select
html = html.replace(
  `      <select id="barFiltroMes" onchange="renderContaBar()" style="border:1px solid var(--g2);border-radius:6px;padding:4px 8px;font-size:.8rem"><option value="">Todos os meses</option></select>`,
  `<!-- barFiltroMes removido — substituído por abas abaixo -->`
);

// Adicionar abas logo após o .sh da Conta Bar
html = html.replace(
  `  <div class="cards" id="barCards"></div>`,
  `  <div id="barMesTabs" class="sc-tabs" style="margin-bottom:12px"></div>
  <div class="cards" id="barCards"></div>`
);

// CONTA HOLDING: substituir select
html = html.replace(
  `      <select id="holdingFiltroMes" onchange="renderContaHolding()" style="border:1px solid var(--g2);border-radius:6px;padding:4px 8px;font-size:.8rem"><option value="">Todos os meses</option></select>`,
  `<!-- holdingFiltroMes removido — substituído por abas abaixo -->`
);

// Adicionar abas logo após o .sh da Conta Holding
html = html.replace(
  `  <div class="cards" id="holdingCards"></div>`,
  `  <div id="holdingMesTabs" class="sc-tabs" style="margin-bottom:12px"></div>
  <div class="cards" id="holdingCards"></div>`
);

console.log('1. HTML: selects removidos, divs de tabs adicionadas.');

// ─── 2. Substituir as funções renderContaBar e renderContaHolding no JS ───

// Substituir popularFiltroBar + renderContaBar
const oldBarFns = `function renderContaBar(){
  if(!DB)return;
  const sb=calcSaldoBar();
  document.getElementById('barSaldoVal').textContent=brl(sb);
  document.getElementById('barSaldoVal').className='sv '+(sb>=0?'green':'red');
  document.getElementById('barSaldoAbertura').textContent='Abertura: '+brl(DB.saldoAberturaBar||0);
  popularFiltroBar();
  const filtro=document.getElementById('barFiltroMes').value;
  let txns=[...DB.extratoBar];
  if(filtro)txns=txns.filter(t=>getMes(t.data)===filtro);
  txns.sort((a,b)=>b.data.localeCompare(a.data)||(b.hora||'').localeCompare(a.hora||''));
  const entTotal=txns.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  const saiTotal=txns.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
  document.getElementById('barCards').innerHTML=[
    {l:'Entradas'+(filtro?' (mês)':''),v:brl(entTotal),c:'green'},
    {l:'Saídas'+(filtro?' (mês)':''),v:brl(saiTotal),c:'red'},
    {l:'Resultado'+(filtro?' (mês)':''),v:brl(entTotal-saiTotal),c:(entTotal-saiTotal)>=0?'green':'red'},
  ].map(c=>\`<div class="card"><div class="cl">\${c.l}</div><div class="cv \${c.c}">\${c.v}</div></div>\`).join('');
  const catsBar=Object.keys(CATS_BAR);
  const tbody=document.querySelector('#barTable tbody');
  tbody.innerHTML=txns.length?txns.map(t=>\`<tr>
    <td>\${fmtD(t.data)}</td>
    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="\${t.nome}">\${t.nome}</td>
    <td><span class="chip">\${t.tipo||'Pix'}</span></td>
    <td><select class="cat-sel" onchange="editarCatBar('\${t.id}',this.value)">\${catsBar.map(k=>\`<option value="\${k}"\${t.cat===k?' selected':''}>\${CATS_BAR[k]}</option>\`).join('')}</select></td>
    <td class="tr bold green">\${t.dir==='entrada'?brl(t.valor):''}</td>
    <td class="tr bold red">\${t.dir==='saida'?brl(t.valor):''}</td>
    <td class="admin-only"><button class="btn btn-danger btn-sm" onclick="deletarBarTxn('\${t.id}')">🗑️</button></td>
  </tr>\`).join(''):'<tr><td colspan="7" class="empty">Nenhuma transação. Importe um XLSX do InfinitePay.</td></tr>';
}`;

const newBarFns = `// ─── CONTA BAR — mês ativo ───
let barMesAtivo = new Date().toISOString().slice(0,7);

function renderBarMesTabs(){
  const tabsEl = document.getElementById('barMesTabs');
  if(!tabsEl) return;
  const meses = [...new Set(DB.extratoBar.map(t=>getMes(t.data)).filter(Boolean))].sort();
  const cur = new Date().toISOString().slice(0,7);
  if(!meses.includes(cur)) meses.push(cur);
  meses.sort();
  // Garantir que barMesAtivo seja válido
  if(!meses.includes(barMesAtivo)) barMesAtivo = meses[meses.length-1] || cur;
  tabsEl.innerHTML = meses.map(m => {
    const [y,mo] = m.split('-');
    const label = MESES[parseInt(mo)-1].slice(0,3)+'/'+y.slice(2);
    return \`<button class="sc-tab\${m===barMesAtivo?' active':''}" onclick="barMesAtivo='\${m}';renderContaBar()">\${label}</button>\`;
  }).join('');
}

function renderContaBar(){
  if(!DB)return;
  const sb=calcSaldoBar();
  document.getElementById('barSaldoVal').textContent=brl(sb);
  document.getElementById('barSaldoVal').className='sv '+(sb>=0?'green':'red');
  document.getElementById('barSaldoAbertura').textContent='Abertura: '+brl(DB.saldoAberturaBar||0);
  renderBarMesTabs();
  const mes = barMesAtivo;
  let txns=[...DB.extratoBar].filter(t=>getMes(t.data)===mes);
  txns.sort((a,b)=>b.data.localeCompare(a.data)||(b.hora||'').localeCompare(a.hora||''));
  const entTotal=txns.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  const saiTotal=txns.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
  const res=entTotal-saiTotal;
  // Cards por categoria de entrada (top 3)
  const catEnt={};
  txns.filter(t=>t.dir==='entrada').forEach(t=>{ catEnt[t.cat]=(catEnt[t.cat]||0)+t.valor; });
  const topCats=Object.entries(catEnt).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const extraCards=topCats.map(([k,v])=>({l:CATS_BAR[k]||k,v:brl(v),c:'green'}));
  document.getElementById('barCards').innerHTML=[
    {l:'Entradas no mês',v:brl(entTotal),c:'green',s:txns.filter(t=>t.dir==='entrada').length+' transações'},
    {l:'Saídas no mês',v:brl(saiTotal),c:'red',s:txns.filter(t=>t.dir==='saida').length+' transações'},
    {l:'Resultado do mês',v:brl(res),c:res>=0?'green':'red',s:'saldo do período'},
    ...extraCards.map(c=>({...c,s:'entradas por categoria'}))
  ].map(c=>\`<div class="card"><div class="cl">\${c.l}</div><div class="cv \${c.c}">\${c.v}</div>\${c.s?'<div class="cs">'+c.s+'</div>':''}</div>\`).join('');
  const catsBar=Object.keys(CATS_BAR);
  const tbody=document.querySelector('#barTable tbody');
  tbody.innerHTML=txns.length?txns.map(t=>\`<tr>
    <td>\${fmtD(t.data)}</td>
    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="\${t.nome}">\${t.nome}</td>
    <td><span class="chip">\${t.tipo||'Pix'}</span></td>
    <td><select class="cat-sel" onchange="editarCatBar('\${t.id}',this.value)">\${catsBar.map(k=>\`<option value="\${k}"\${t.cat===k?' selected':''}>\${CATS_BAR[k]}</option>\`).join('')}</select></td>
    <td class="tr bold green">\${t.dir==='entrada'?brl(t.valor):''}</td>
    <td class="tr bold red">\${t.dir==='saida'?brl(t.valor):''}</td>
    <td class="admin-only"><button class="btn btn-danger btn-sm" onclick="deletarBarTxn('\${t.id}')">🗑️</button></td>
  </tr>\`).join(''):'<tr><td colspan="7" class="empty">Nenhuma transação neste mês. Importe um XLSX do InfinitePay.</td></tr>';
}`;

if (!html.includes(oldBarFns)) {
  console.error('ERRO: função renderContaBar não encontrada exatamente!');
  // Try to find partial
  const idx = html.indexOf('function renderContaBar()');
  if (idx >= 0) {
    const line = html.slice(0, idx).split('\n').length;
    console.log('renderContaBar encontrado na linha', line, '— verifique o conteúdo exato.');
  }
  process.exit(1);
}
html = html.replace(oldBarFns, newBarFns);
console.log('2. renderContaBar refatorada com abas de mês.');

// Substituir popularFiltroHolding + renderContaHolding
const oldHoldingFns = `function popularFiltroHolding(){
  const meses=new Set(DB.extratoHolding.map(t=>getMes(t.data)).filter(Boolean));
  const sel=document.getElementById('holdingFiltroMes');
  const cur=sel.value;
  sel.innerHTML='<option value="">Todos os meses</option>'+[...meses].sort().reverse().map(m=>{
    const[y,mo]=m.split('-');return\`<option value="\${m}">\${MESES[parseInt(mo)-1]}/\${y}</option>\`;
  }).join('');
  if(cur)sel.value=cur;
}

function renderContaHolding(){
  if(!DB)return;
  const sh=calcSaldoHolding();
  document.getElementById('holdingSaldoVal').textContent=brl(sh);
  document.getElementById('holdingSaldoVal').className='sv '+(sh>=0?'green':'red');
  document.getElementById('holdingSaldoAbertura').textContent='Abertura: '+brl(DB.saldoAberturaHolding||0);
  popularFiltroHolding();
  const filtro=document.getElementById('holdingFiltroMes').value;
  let txns=[...DB.extratoHolding];
  if(filtro)txns=txns.filter(t=>getMes(t.data)===filtro);
  txns.sort((a,b)=>b.data.localeCompare(a.data));
  const entTotal=txns.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  const saiTotal=txns.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
  document.getElementById('holdingCards').innerHTML=[
    {l:'Entradas'+(filtro?' (mês)':''),v:brl(entTotal),c:'green'},
    {l:'Saídas'+(filtro?' (mês)':''),v:brl(saiTotal),c:'red'},
    {l:'Resultado'+(filtro?' (mês)':''),v:brl(entTotal-saiTotal),c:(entTotal-saiTotal)>=0?'green':'red'},
  ].map(c=>\`<div class="card"><div class="cl">\${c.l}</div><div class="cv \${c.c}">\${c.v}</div></div>\`).join('');`;

const newHoldingFns = `// ─── CONTA HOLDING — mês ativo ───
let holdingMesAtivo = new Date().toISOString().slice(0,7);

function renderHoldingMesTabs(){
  const tabsEl = document.getElementById('holdingMesTabs');
  if(!tabsEl) return;
  const meses = [...new Set(DB.extratoHolding.map(t=>getMes(t.data)).filter(Boolean))].sort();
  const cur = new Date().toISOString().slice(0,7);
  if(!meses.includes(cur)) meses.push(cur);
  meses.sort();
  if(!meses.includes(holdingMesAtivo)) holdingMesAtivo = meses[meses.length-1] || cur;
  tabsEl.innerHTML = meses.map(m => {
    const [y,mo] = m.split('-');
    const label = MESES[parseInt(mo)-1].slice(0,3)+'/'+y.slice(2);
    return \`<button class="sc-tab\${m===holdingMesAtivo?' active':''}" onclick="holdingMesAtivo='\${m}';renderContaHolding()">\${label}</button>\`;
  }).join('');
}

function renderContaHolding(){
  if(!DB)return;
  const sh=calcSaldoHolding();
  document.getElementById('holdingSaldoVal').textContent=brl(sh);
  document.getElementById('holdingSaldoVal').className='sv '+(sh>=0?'green':'red');
  document.getElementById('holdingSaldoAbertura').textContent='Abertura: '+brl(DB.saldoAberturaHolding||0);
  renderHoldingMesTabs();
  const mes = holdingMesAtivo;
  let txns=[...DB.extratoHolding].filter(t=>getMes(t.data)===mes);
  txns.sort((a,b)=>b.data.localeCompare(a.data));
  const entTotal=txns.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  const saiTotal=txns.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
  const res=entTotal-saiTotal;
  document.getElementById('holdingCards').innerHTML=[
    {l:'Entradas no mês',v:brl(entTotal),c:'green',s:txns.filter(t=>t.dir==='entrada').length+' transações'},
    {l:'Saídas no mês',v:brl(saiTotal),c:'red',s:txns.filter(t=>t.dir==='saida').length+' transações'},
    {l:'Resultado do mês',v:brl(res),c:res>=0?'green':'red',s:'saldo do período'},
  ].map(c=>\`<div class="card"><div class="cl">\${c.l}</div><div class="cv \${c.c}">\${c.v}</div>\${c.s?'<div class="cs">'+c.s+'</div>':''}</div>\`).join('');`;

if (!html.includes(oldHoldingFns)) {
  console.error('ERRO: funções popularFiltroHolding/renderContaHolding não encontradas!');
  process.exit(1);
}
html = html.replace(oldHoldingFns, newHoldingFns);
console.log('3. renderContaHolding refatorada com abas de mês.');

// ─── Verificação final ───
console.log('\n=== VERIFICAÇÃO ===');
console.log('barMesTabs HTML:', html.includes('id="barMesTabs"'));
console.log('holdingMesTabs HTML:', html.includes('id="holdingMesTabs"'));
console.log('barMesAtivo JS:', html.includes('let barMesAtivo'));
console.log('holdingMesAtivo JS:', html.includes('let holdingMesAtivo'));
console.log('renderBarMesTabs:', html.includes('function renderBarMesTabs'));
console.log('renderHoldingMesTabs:', html.includes('function renderHoldingMesTabs'));
console.log('Tamanho HTML:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Salvo.');

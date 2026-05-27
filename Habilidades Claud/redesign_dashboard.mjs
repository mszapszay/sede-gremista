import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── 1. Novo HTML do Dashboard ───
const oldDash = `<div id="tab-dashboard" class="page active">
  <div class="cards" id="dashCards"></div>

  <!-- INFORMAÇÕES DA SEDE -->
  <div class="sh" style="margin-top:4px"><h2>Informações da Sede</h2></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px;margin-bottom:16px">

    <div class="acct-card" style="flex-direction:column;align-items:flex-start;gap:4px">
      <div class="acct-bank">📍 Endereço</div>
      <div class="acct-name" style="font-size:.9rem">Sede Social</div>
      <div class="acct-details" style="line-height:1.7">
        Rua Luiz Carlos Pinheiro Cabral, 201<br>
        Farrapos · Porto Alegre – RS<br>
        CEP 90250-500
      </div>
      <a href="https://maps.google.com/?q=Rua+Luiz+Carlos+Pinheiro+Cabral,+201,+Porto+Alegre" target="_blank" style="font-size:.7rem;color:var(--acc);margin-top:4px;text-decoration:none">🗺 Ver no Maps</a>
    </div>

    <div class="acct-card" style="flex-direction:column;align-items:flex-start;gap:4px">
      <div class="acct-bank">🏦 CloudWalk / InfinitePay</div>
      <div class="acct-name" style="font-size:.9rem">Conta Bar (MEI)</div>
      <div class="acct-details" style="line-height:1.7">
        CNPJ: 60.982.530/0001-04<br>
        Ag: 0001 &nbsp;·&nbsp; CC: 18703876-5
      </div>
    </div>

    <div class="acct-card" style="flex-direction:column;align-items:flex-start;gap:4px">
      <div class="acct-bank">🏦 PicPay Empresas / CXBX Patrimonial</div>
      <div class="acct-name" style="font-size:.9rem">Conta Holding</div>
      <div class="acct-details" style="line-height:1.7">
        CNPJ: 65.181.048/0001-99<br>
        Ag: 0001 &nbsp;·&nbsp; CC: 1330685172
      </div>
    </div>

  </div>

  <!-- PENDÊNCIAS DO MÊS -->
  <div class="sh" style="margin-top:2px"><h2 id="dashPendenciasTitle">✅ Pendências do Mês</h2></div>
  <div id="dashPendencias" style="background:#fff;border-radius:var(--r);box-shadow:0 1px 3px rgba(0,0,0,.08);padding:14px 16px;margin-bottom:14px">
    <div class="empty">Carregando...</div>
  </div>
  <table id="dashMovs" style="display:none"><tbody></tbody></table>
</div>`;

const newDash = `<div id="tab-dashboard" class="page active">

  <!-- CABEÇALHO -->
  <div class="page-hdr">
    <div>
      <div class="page-title">Dashboard <small id="dashDate" style="font-size:13px;font-weight:400;color:var(--txt2);margin-left:8px"></small></div>
    </div>
  </div>

  <!-- KPIs — 4 colunas -->
  <div id="dashKpis" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px"></div>

  <!-- CORPO — 2 colunas -->
  <div style="display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:start" id="dashGrid">

    <!-- COLUNA ESQUERDA -->
    <div style="display:flex;flex-direction:column;gap:16px">

      <!-- Resumo financeiro do mês -->
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:13px;font-weight:700">📊 Resumo Financeiro</div>
          <div id="dashMesLabel" style="font-size:11px;color:var(--txt2);background:var(--card2);border:1px solid var(--border);border-radius:20px;padding:2px 10px"></div>
        </div>
        <div id="dashMesCards" style="display:grid;grid-template-columns:repeat(4,1fr);gap:0">
          <div style="padding:14px 16px;border-right:1px solid var(--border)">
            <div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Ent. Bar</div>
            <div id="dEntBar" style="font-size:18px;font-weight:700;color:var(--grn)">—</div>
            <div id="dEntBarN" style="font-size:11px;color:var(--txt2);margin-top:2px"></div>
          </div>
          <div style="padding:14px 16px;border-right:1px solid var(--border)">
            <div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Saí. Bar</div>
            <div id="dSaiBar" style="font-size:18px;font-weight:700;color:var(--red)">—</div>
            <div id="dSaiBarN" style="font-size:11px;color:var(--txt2);margin-top:2px"></div>
          </div>
          <div style="padding:14px 16px;border-right:1px solid var(--border)">
            <div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Ent. Holding</div>
            <div id="dEntHold" style="font-size:18px;font-weight:700;color:var(--grn)">—</div>
            <div id="dEntHoldN" style="font-size:11px;color:var(--txt2);margin-top:2px"></div>
          </div>
          <div style="padding:14px 16px">
            <div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Saí. Holding</div>
            <div id="dSaiHold" style="font-size:18px;font-weight:700;color:var(--red)">—</div>
            <div id="dSaiHoldN" style="font-size:11px;color:var(--txt2);margin-top:2px"></div>
          </div>
        </div>
      </div>

      <!-- Próximos jogos -->
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:13px;font-weight:700">⚽ Próximos Jogos</div>
        <div id="dashProxJogos" style="padding:6px 0"></div>
      </div>

      <!-- Últimas movimentações -->
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:13px;font-weight:700">💳 Últimas Movimentações — Bar</div>
          <button class="btn btn-ghost btn-xs" onclick="showTab('bar')">Ver tudo →</button>
        </div>
        <table style="width:100%;border-collapse:collapse" id="dashUltMovs">
          <tbody></tbody>
        </table>
      </div>

    </div>

    <!-- COLUNA DIREITA -->
    <div style="display:flex;flex-direction:column;gap:14px">

      <!-- Pendências do mês -->
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:13px;font-weight:700">✅ Pendências</div>
          <div id="dashPendenciasTitle" style="font-size:11px;color:var(--txt2)"></div>
        </div>
        <div id="dashPendencias" style="padding:10px 14px;max-height:300px;overflow-y:auto"></div>
      </div>

      <!-- Inadimplentes -->
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:13px;font-weight:700">⚠️ Mensalidades Pendentes</div>
          <button class="btn btn-ghost btn-xs" onclick="showTab('mensalidades')">Ver →</button>
        </div>
        <div id="dashInadimplentes" style="padding:6px 0;max-height:220px;overflow-y:auto"></div>
      </div>

      <!-- Informações da Sede -->
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:13px;font-weight:700">ℹ️ Sede & Contas</div>
        <div style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">

          <div>
            <div style="font-size:10px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">📍 Endereço</div>
            <div style="font-size:12px;color:var(--txt);line-height:1.6">Rua Luiz Carlos Pinheiro Cabral, 201<br>Farrapos · Porto Alegre – RS · CEP 90250-500</div>
            <a href="https://maps.google.com/?q=Rua+Luiz+Carlos+Pinheiro+Cabral,+201,+Porto+Alegre" target="_blank" style="font-size:11px;color:var(--acc);text-decoration:none;font-weight:600;display:inline-block;margin-top:3px">🗺 Ver no Maps</a>
          </div>

          <div style="border-top:1px solid var(--border);padding-top:10px">
            <div style="font-size:10px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">🏦 Conta Bar (MEI)</div>
            <div style="font-size:12px;color:var(--txt2);line-height:1.7">CloudWalk / InfinitePay<br>CNPJ: 60.982.530/0001-04<br>Ag: 0001 · CC: 18703876-5</div>
          </div>

          <div style="border-top:1px solid var(--border);padding-top:10px">
            <div style="font-size:10px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">🏦 Conta Holding</div>
            <div style="font-size:12px;color:var(--txt2);line-height:1.7">PicPay Empresas / CXBX Patrimonial<br>CNPJ: 65.181.048/0001-99<br>Ag: 0001 · CC: 1330685172</div>
          </div>

        </div>
      </div>

    </div>
  </div>

  <table id="dashMovs" style="display:none"><tbody></tbody></table>
</div>`;

if (!html.includes(oldDash)) {
  console.error('ERRO: HTML do dashboard não encontrado exatamente. Verifique o conteúdo.');
  process.exit(1);
}
html = html.replace(oldDash, newDash);
console.log('1. HTML do dashboard substituído.');

// ─── 2. Nova função renderDash ───
const oldRenderDash = `function renderDash(){
  if(!DB)return;
  const mes=new Date().toISOString().slice(0,7);
  const barM=DB.extratoBar.filter(t=>getMes(t.data)===mes);
  const entBarM=barM.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  const saiBarM=barM.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
  const holdM=DB.extratoHolding.filter(t=>getMes(t.data)===mes);
  const entHoldM=holdM.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  let mensTotal=0;
  (DB.membros||[]).forEach(mb=>{if((DB.mensalidades[mb.id]||{})[mes]==='pago')mensTotal+=30;});
  let pendente=0;
  Object.values(DB.comandas||{}).forEach(items=>items.forEach(i=>{if(i.status==='pendente')pendente+=calcCmd(i);}));
  const saldoBar=calcSaldoBar(),saldoHolding=calcSaldoHolding();
  const cards=[
    {l:'Saldo Conta Bar',v:brl(saldoBar),c:saldoBar>=0?'green':'red',s:'InfinitePay'},
    {l:'Saldo Conta Holding',v:brl(saldoHolding),c:saldoHolding>=0?'green':'red',s:'PicPay'},
    {l:'Entradas Bar (mês)',v:brl(entBarM),c:'green',s:barM.filter(t=>t.dir==='entrada').length+' transações'},
    {l:'Saídas Bar (mês)',v:brl(saiBarM),c:'red',s:barM.filter(t=>t.dir==='saida').length+' transações'},
    {l:'Entradas Holding (mês)',v:brl(entHoldM),c:'green',s:holdM.filter(t=>t.dir==='entrada').length+' transações'},
    {l:'Mensalidades (mês)',v:brl(mensTotal),c:'green',s:'grade manual'},
    {l:'Comandas pendentes',v:brl(pendente),c:'yellow',s:'a receber'},
  ];
  document.getElementById('dashCards').innerHTML=cards.map(c=>\`<div class="card"><div class="cl">\${c.l}</div><div class="cv \${c.c}">\${c.v}</div><div class="cs">\${c.s}</div></div>\`).join('');
  // ── Pendências do checklist ──
  renderSedeDashPendencias();
}`;

const newRenderDash = `function renderDash(){
  if(!DB)return;
  const now=new Date();
  const mes=now.toISOString().slice(0,7);
  const [ano,mo]=mes.split('-');
  const mesLabel=_SEDE_MESES?_SEDE_MESES[parseInt(mo)-1]+'/'+ano : mes;
  const DOW=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const dateStr=now.getDate()+' de '+(_SEDE_MESES?_SEDE_MESES[now.getMonth()].toLowerCase():mo)+' de '+ano+' · '+DOW[now.getDay()];
  const el=document.getElementById('dashDate');if(el)el.textContent=dateStr;
  const elMes=document.getElementById('dashMesLabel');if(elMes)elMes.textContent=mesLabel;

  // ── KPIs ──
  const saldoBar=calcSaldoBar(),saldoHolding=calcSaldoHolding();
  let mensTotal=0,mensPagos=0,mensTotal_n=0;
  const ativos=(DB.membros||[]).filter(m=>m.status!=='fora');
  ativos.forEach(mb=>{
    mensTotal_n++;
    const st=(DB.mensalidades[mb.id]||{})[mes];
    if(st==='pago'){mensTotal+=30;mensPagos++;}
  });
  let pendente=0,nComandas=0;
  Object.values(DB.comandas||{}).forEach(items=>items.forEach(i=>{if(i.status==='pendente'){pendente+=calcCmd(i);nComandas++;}}));

  const kpis=[
    {l:'Saldo Conta Bar',v:brl(saldoBar),c:saldoBar>=0?'var(--grn)':'var(--red)',sub:'InfinitePay',ico:'🍺'},
    {l:'Saldo Conta Holding',v:brl(saldoHolding),c:saldoHolding>=0?'var(--grn)':'var(--red)',sub:'PicPay',ico:'🏦'},
    {l:'Mensalidades — '+mesLabel,v:brl(mensTotal),c:'var(--grn)',sub:mensPagos+' de '+mensTotal_n+' membros',ico:'💰'},
    {l:'Comandas Pendentes',v:brl(pendente),c:pendente>0?'var(--org)':'var(--grn)',sub:nComandas+' em aberto',ico:'📋'},
  ];
  document.getElementById('dashKpis').innerHTML=kpis.map(k=>\`
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px">
      <div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">\${k.ico} \${k.l}</div>
      <div style="font-size:22px;font-weight:700;color:\${k.c};line-height:1">\${k.v}</div>
      <div style="font-size:11px;color:var(--txt2);margin-top:4px">\${k.sub}</div>
    </div>\`).join('');

  // ── Resumo do mês ──
  const barM=DB.extratoBar.filter(t=>getMes(t.data)===mes);
  const entBarM=barM.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  const saiBarM=barM.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
  const holdM=DB.extratoHolding.filter(t=>getMes(t.data)===mes);
  const entHoldM=holdM.filter(t=>t.dir==='entrada').reduce((s,t)=>s+t.valor,0);
  const saiHoldM=holdM.filter(t=>t.dir==='saida').reduce((s,t)=>s+t.valor,0);
  const _sv=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val;};
  _sv('dEntBar',brl(entBarM));_sv('dEntBarN',barM.filter(t=>t.dir==='entrada').length+' tx');
  _sv('dSaiBar',brl(saiBarM));_sv('dSaiBarN',barM.filter(t=>t.dir==='saida').length+' tx');
  _sv('dEntHold',brl(entHoldM));_sv('dEntHoldN',holdM.filter(t=>t.dir==='entrada').length+' tx');
  _sv('dSaiHold',brl(saiHoldM));_sv('dSaiHoldN',holdM.filter(t=>t.dir==='saida').length+' tx');

  // ── Próximos jogos ──
  const todayStr=now.toISOString().slice(0,10);
  const proxJogos=typeof SEDE_CAL_SEED!=='undefined'
    ? Object.entries(SEDE_CAL_SEED)
        .filter(([ds])=>ds>=todayStr)
        .sort(([a],[b])=>a.localeCompare(b))
        .slice(0,5)
        .flatMap(([ds,evts])=>evts.map(ev=>({ds,ev})))
    : [];
  const jogoEl=document.getElementById('dashProxJogos');
  if(jogoEl){
    if(!proxJogos.length){
      jogoEl.innerHTML='<div style="padding:12px 16px;font-size:12px;color:var(--txt2);font-style:italic">Sem jogos agendados em breve.</div>';
    } else {
      const DOW_PT=['dom','seg','ter','qua','qui','sex','sáb'];
      jogoEl.innerHTML=proxJogos.map(({ds,ev})=>{
        const [y,m,d]=ds.split('-');
        const dow=DOW_PT[new Date(+y,+m-1,+d).getDay()];
        const isGremio=/grêmio|gremio/i.test(ev);
        const isSelecao=/brasil|seleção/i.test(ev);
        const dot=isGremio?'#004A94':isSelecao?'#009c3b':'var(--txt2)';
        const label=isGremio?'Grêmio':isSelecao?'Seleção':'Jogo';
        const timeMatch=ev.match(/^(\d{1,2}:\d{2})\s*-\s*/);
        const time=timeMatch?timeMatch[1]:'';
        const text=ev.replace(/^\d{1,2}:\d{2}\s*-\s*/,'');
        return \`<div style="display:flex;align-items:center;gap:12px;padding:9px 16px;border-bottom:1px solid var(--border)">
          <div style="flex-shrink:0;text-align:center;min-width:38px">
            <div style="font-size:18px;font-weight:800;color:var(--txt);line-height:1">\${d}</div>
            <div style="font-size:10px;color:var(--txt2);text-transform:uppercase">\${dow} \${_SEDE_MESES?_SEDE_MESES[+m-1].slice(0,3):m}</div>
          </div>
          <div style="width:3px;height:36px;border-radius:2px;background:\${dot};flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${text}</div>
            <div style="font-size:11px;color:var(--txt2);margin-top:1px">\${label}\${time?' · '+time:''}h</div>
          </div>
        </div>\`;
      }).join('');
    }
  }

  // ── Últimas movimentações Bar ──
  const ultMovsTbody=document.querySelector('#dashUltMovs tbody');
  if(ultMovsTbody){
    const ultimas=[...DB.extratoBar].sort((a,b)=>b.data.localeCompare(a.data)||(b.hora||'').localeCompare(a.hora||'')).slice(0,8);
    ultMovsTbody.innerHTML=ultimas.length
      ? ultimas.map(t=>\`<tr style="border-top:1px solid var(--border)">
          <td style="padding:7px 16px;font-size:12px;color:var(--txt2);white-space:nowrap">\${fmtD(t.data)}</td>
          <td style="padding:7px 8px;font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--txt)">\${t.nome}</td>
          <td style="padding:7px 8px"><span style="background:var(--card2);border:1px solid var(--border);border-radius:4px;padding:1px 6px;font-size:11px;color:var(--txt2)">\${CATS_BAR[t.cat]||t.cat}</span></td>
          <td style="padding:7px 16px;font-size:12px;font-weight:700;text-align:right;color:\${t.dir==='entrada'?'var(--grn)':'var(--red)'}">\${t.dir==='entrada'?'+':'-'}\${brl(t.valor)}</td>
        </tr>\`).join('')
      : '<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--txt2);font-size:12px">Nenhuma movimentação importada ainda.</td></tr>';
  }

  // ── Inadimplentes do mês atual ──
  const inadEl=document.getElementById('dashInadimplentes');
  if(inadEl){
    const inad=(DB.membros||[]).filter(m=>{
      if(m.status==='fora')return false;
      const st=(DB.mensalidades[m.id]||{})[mes];
      return !st||st==='pendente';
    }).sort((a,b)=>(a.apelido||a.nome).localeCompare(b.apelido||b.nome));
    if(!inad.length){
      inadEl.innerHTML='<div style="padding:12px 16px;font-size:12px;color:var(--grn);font-weight:600">✓ Todos em dia neste mês.</div>';
    } else {
      inadEl.innerHTML=inad.map(m=>{
        const apelido=m.apelido||m.nome.split(' ')[0];
        return \`<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 16px;border-bottom:1px solid var(--border)">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--txt)">\${apelido}</div>
            <div style="font-size:11px;color:var(--txt2)">\${m.nome}</div>
          </div>
          <span style="background:var(--red2);color:var(--red);border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700">Pendente</span>
        </div>\`;
      }).join('');
    }
  }

  // ── Pendências do checklist ──
  renderSedeDashPendencias();
}`;

if (!html.includes(oldRenderDash)) {
  console.error('ERRO: função renderDash não encontrada!');
  process.exit(1);
}
html = html.replace(oldRenderDash, newRenderDash);
console.log('2. Função renderDash substituída.');

// ─── 3. Corrigir renderSedeDashPendencias para o novo layout ───
// O title agora é um <div> simples, não um h2 — só atualizar o innerHTML
html = html.replace(
  `if (titleEl) titleEl.innerHTML =
    \`✅ Checklist — \${mesNome} <span style="font-size:.7rem;font-weight:400;color:var(--g5);margin-left:6px">\${doneItems}/\${totalItems} · \${pct}%</span>\`;`,
  `if (titleEl) titleEl.textContent = \`\${doneItems}/\${totalItems} · \${pct}%\`;`
);
console.log('3. renderSedeDashPendencias adaptada.');

// ─── 4. CSS responsivo para o dashboard ───
const mediaQuery = `@media(max-width:900px){#dashKpis{grid-template-columns:1fr 1fr}#dashGrid{grid-template-columns:1fr}#dashMesCards{grid-template-columns:1fr 1fr}}`;
html = html.replace('</style>', mediaQuery + '\n</style>');
console.log('4. CSS responsivo adicionado.');

// ─── Verificação ───
console.log('\n=== VERIFICAÇÃO ===');
console.log('dashKpis:', html.includes('id="dashKpis"'));
console.log('dashProxJogos:', html.includes('id="dashProxJogos"'));
console.log('dashUltMovs:', html.includes('id="dashUltMovs"'));
console.log('dashInadimplentes:', html.includes('id="dashInadimplentes"'));
console.log('dashPendencias:', html.includes('id="dashPendencias"'));
console.log('Sede & Contas card:', html.includes('Sede & Contas'));
console.log('Tamanho HTML:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('Salvo.');

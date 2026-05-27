import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', 'utf8');

// ─── 1. Brand: "SEDE CAIXA BAIXA" + "Financeiro" embaixo ───
html = html.replace(
  `<div class="brand">⚽ SEDE<small>Caixa Baixa · Financeiro</small></div>`,
  `<div class="brand">SEDE CAIXA BAIXA<small>Financeiro</small></div>`
);
console.log('1. Brand atualizado.');

// ─── 2. Dia da semana por extenso no header do dashboard ───
html = html.replace(
  `const DOW=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const dateStr=now.getDate()+' de '+(_SEDE_MESES?_SEDE_MESES[now.getMonth()].toLowerCase():mo)+' de '+ano+' · '+DOW[now.getDay()];`,
  `const DOW=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const dateStr=now.getDate()+' de '+(_SEDE_MESES?_SEDE_MESES[now.getMonth()]:mo)+' de '+ano+' · '+DOW[now.getDay()];`
);
console.log('2. Dia da semana por extenso no header.');

// ─── 3. Resumo financeiro — rótulos por extenso no HTML ───
html = html.replace(
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Ent. Bar</div>`,
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Entradas — Bar</div>`
);
html = html.replace(
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Saí. Bar</div>`,
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Saídas — Bar</div>`
);
html = html.replace(
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Ent. Holding</div>`,
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Entradas — Holding</div>`
);
html = html.replace(
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Saí. Holding</div>`,
  `<div style="font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Saídas — Holding</div>`
);
console.log('3. Rótulos do resumo financeiro por extenso.');

// ─── 4. Próximos Jogos — corrigir bugs + formatação ───
const oldJogos = `  const jogoEl=document.getElementById('dashProxJogos');
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
        const timeMatch=ev.match(/^(d{1,2}:d{2})s*-s*/);
        const time=timeMatch?timeMatch[1]:'';
        const text=ev.replace(/^d{1,2}:d{2}s*-s*/,'');
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
  }`;

const newJogos = `  const jogoEl=document.getElementById('dashProxJogos');
  if(jogoEl){
    if(!proxJogos.length){
      jogoEl.innerHTML='<div style="padding:14px 16px;font-size:12px;color:var(--txt2);font-style:italic">Nenhum jogo confirmado nos próximos dias.</div>';
    } else {
      const DOW_FULL=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
      const DOW_CURTO=['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'];
      jogoEl.innerHTML=proxJogos.map(({ds,ev})=>{
        const [y,m,d]=ds.split('-');
        const dowIdx=new Date(+y,+m-1,+d).getDay();
        const dowCurto=DOW_CURTO[dowIdx];
        const mes=_SEDE_MESES?_SEDE_MESES[+m-1]:'';
        const isGremio=/grêmio|gremio/i.test(ev);
        const isSelecao=/brasil|seleção/i.test(ev);
        const dot=isGremio?'#004A94':isSelecao?'#009c3b':'#64748b';
        const cat=isGremio?'Grêmio':isSelecao?'Seleção Brasileira':'Evento';
        // Extrair horário corretamente
        const timeMatch=ev.match(/^(\d{1,2}:\d{2})\s*-\s*/);
        const time=timeMatch?timeMatch[1]:'';
        const text=ev.replace(/^(\d{1,2}:\d{2})\s*-\s*/,'').trim();
        const sub=time?cat+' · '+time+'h':cat;
        return \`<div style="display:flex;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--border)">
          <div style="flex-shrink:0;text-align:center;min-width:46px">
            <div style="font-size:20px;font-weight:800;color:var(--txt);line-height:1">\${d}</div>
            <div style="font-size:10px;color:var(--txt2);margin-top:1px;text-transform:uppercase;letter-spacing:.3px">\${dowCurto}</div>
            <div style="font-size:10px;color:var(--txt2);text-transform:uppercase;letter-spacing:.3px">\${mes}</div>
          </div>
          <div style="width:3px;height:40px;border-radius:2px;background:\${dot};flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;color:var(--txt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${text}</div>
            <div style="font-size:11px;color:var(--txt2);margin-top:2px">\${sub}</div>
          </div>
        </div>\`;
      }).join('');
    }
  }`;

if (!html.includes(oldJogos)) {
  console.error('ERRO: bloco dashProxJogos não encontrado!');
  process.exit(1);
}
html = html.replace(oldJogos, newJogos);
console.log('4. Próximos Jogos corrigido (bugs + formatação + texto).');

// ─── 5. Remover "Últimas Movimentações" do HTML do dashboard ───
const oldUltMovsHTML = `
      <!-- Últimas movimentações -->
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:13px;font-weight:700">💳 Últimas Movimentações — Bar</div>
          <button class="btn btn-ghost btn-xs" onclick="showTab('bar')">Ver tudo →</button>
        </div>
        <table style="width:100%;border-collapse:collapse" id="dashUltMovs">
          <tbody></tbody>
        </table>
      </div>`;

if (!html.includes(oldUltMovsHTML)) {
  console.error('ERRO: bloco dashUltMovs HTML não encontrado!');
  process.exit(1);
}
html = html.replace(oldUltMovsHTML, '');
console.log('5. Bloco "Últimas Movimentações" removido do HTML.');

// ─── 6. Remover JS das últimas movimentações em renderDash ───
const oldUltMovsJS = `
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
  }`;

if (!html.includes(oldUltMovsJS)) {
  console.error('ERRO: bloco JS dashUltMovs não encontrado!');
  process.exit(1);
}
html = html.replace(oldUltMovsJS, '');
console.log('6. JS "Últimas Movimentações" removido de renderDash.');

// ─── 7. Calendário — dias da semana por extenso no cabeçalho da grade ───
html = html.replace(
  `const _SEDE_DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];`,
  `const _SEDE_DOW = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];`
);
console.log('7. Cabeçalho da grade do calendário: dias por extenso.');

// ─── 8. Calendário — meses por extenso nas tabs ───
html = html.replace(
  `tabsEl.innerHTML = _SEDE_MESES.map((m,i) =>
      \`<button class="sc-tab" onclick="_sedeCalMonth=\${i+1};renderSedeCalendar();\${i+1===new Date().getMonth()+1?'renderSedeChkList('+( i+1)+')':''}">\${m.slice(0,3)}</button>\`
    ).join('');`,
  `tabsEl.innerHTML = _SEDE_MESES.map((m,i) =>
      \`<button class="sc-tab" onclick="_sedeCalMonth=\${i+1};renderSedeCalendar()">\${m}</button>\`
    ).join('');`
);
console.log('8. Abas do calendário: meses por extenso.');

// ─── Verificação final ───
console.log('\n=== VERIFICAÇÃO ===');
console.log('Brand "SEDE CAIXA BAIXA":', html.includes('SEDE CAIXA BAIXA<small>Financeiro</small>'));
console.log('DOW por extenso (header):', html.includes('Segunda-feira'));
console.log('Rótulos "Entradas — Bar":', html.includes('Entradas — Bar'));
console.log('Rótulos "Saídas — Holding":', html.includes('Saídas — Holding'));
console.log('Regex tempo corrigido:', html.includes('\\d{1,2}:\\d{2}'));
console.log('dashUltMovs removido do HTML:', !html.includes('id="dashUltMovs"'));
console.log('dashUltMovs removido do JS:', !html.includes('ultMovsTbody'));
console.log('DOW calendário por extenso:', html.includes("'Domingo','Segunda-feira'"));
console.log('Meses calendário por extenso:', !html.includes('m.slice(0,3)'));
console.log('Tamanho HTML:', html.length);

writeFileSync('C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html', html, 'utf8');
console.log('\nSalvo.');

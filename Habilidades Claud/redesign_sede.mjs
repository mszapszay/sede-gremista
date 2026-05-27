/**
 * redesign_sede.mjs
 * Rewrites the CSS and HTML structure of sede-financeiro.html to match the CRM visual style.
 * Usage: node redesign_sede.mjs
 */

import { readFileSync, writeFileSync } from 'fs';

const SRC = 'C:/Users/mauri/Downloads/CLAUD - SEDE/sede-financeiro.html';

console.log('Reading', SRC);
let html = readFileSync(SRC, 'utf8');
const originalSize = html.length;
console.log(`Original size: ${originalSize} bytes`);

let errors = 0;

function replace(description, oldStr, newStr) {
  if (!html.includes(oldStr)) {
    console.error(`❌ REPLACEMENT FAILED: "${description}" — old string not found`);
    errors++;
    return;
  }
  html = html.replace(oldStr, newStr);
  console.log(`✅ ${description}`);
}

// ─────────────────────────────────────────────
// STEP 1 — Replace entire <style> block
// ─────────────────────────────────────────────

const styleStart = html.indexOf('<style>');
const styleEnd   = html.lastIndexOf('</style>') + '</style>'.length;

if (styleStart === -1 || styleEnd < '</style>'.length) {
  console.error('❌ Could not locate <style>...</style> block');
  errors++;
} else {
  const newStyle = `<style>
/* ── RESET & ROOT ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
:root{
  --bg:#f0f4f8;--side:#ffffff;--card:#ffffff;--card2:#f5f7fa;--border:#e2e8f0;
  --acc:#1a3a6b;--acc2:rgba(26,58,107,.1);--acc3:#0f2647;
  --txt:#1e293b;--txt2:#64748b;--txt3:#cbd5e1;
  --grn:#16a34a;--grn2:rgba(22,163,74,.1);
  --org:#d97706;--org2:rgba(217,119,6,.1);
  --red:#dc2626;--red2:rgba(220,38,38,.1);
  --pur:#7c3aed;--pur2:rgba(124,58,237,.1);
  --r:8px;--sw:220px;
}

/* ── LAYOUT ── */
body{background:var(--bg);color:var(--txt);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.5;display:flex}
.sidebar{width:var(--sw);min-height:100vh;background:var(--side);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:16px 10px;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto}
.brand{font-size:16px;font-weight:800;color:var(--acc);padding:4px 10px 6px;line-height:1.3;letter-spacing:.5px}
.brand small{display:block;font-size:10px;font-weight:400;color:var(--txt3);text-transform:uppercase;letter-spacing:.6px;margin-top:2px}
.nav-sep{height:1px;background:var(--border);margin:14px 0 8px}
.nav-grp{font-size:10px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.8px;padding:6px 12px 3px}
.nav-item{display:flex;align-items:center;gap:9px;padding:7px 12px;border-radius:var(--r);cursor:pointer;color:var(--txt2);font-weight:500;transition:all .12s;margin-bottom:1px;user-select:none;font-size:13px}
.nav-item:hover{background:var(--card2);color:var(--txt)}
.nav-item.active{background:var(--acc2);color:var(--acc)}
.nav-item .ico{font-size:15px;width:18px;text-align:center}
.nav-badge{margin-left:auto;background:var(--acc);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;min-width:18px;text-align:center}
.nav-badge.red{background:var(--red)}.nav-badge.grn{background:var(--grn)}.nav-badge.pur{background:var(--pur)}
.main{margin-left:var(--sw);flex:1;padding:24px 28px;min-height:100vh;overflow-x:hidden}
.page{display:none}.page.active{display:block}
.page-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;gap:12px;flex-wrap:wrap}
.page-title{font-size:19px;font-weight:700}
.page-title small{display:block;font-size:12px;font-weight:400;color:var(--txt2);margin-top:1px}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r);border:none;cursor:pointer;font-size:13px;font-weight:600;transition:all .12s}
.btn-primary{background:var(--acc);color:#fff}.btn-primary:hover{background:var(--acc3)}
.btn-ghost{background:transparent;color:var(--txt2);border:1px solid var(--border)}.btn-ghost:hover{background:var(--card2);color:var(--txt)}
.btn-danger{background:var(--red2);color:var(--red);border:1px solid transparent}.btn-danger:hover{background:var(--red);color:#fff}
.btn-warn{background:var(--org2);color:var(--org);border:1px solid transparent}.btn-warn:hover{background:var(--org);color:#fff}
.btn-pur{background:var(--pur2);color:var(--pur);border:1px solid transparent}.btn-pur:hover{background:var(--pur);color:#fff}
.btn-grn{background:var(--grn2);color:var(--grn);border:1px solid transparent}.btn-grn:hover{background:var(--grn);color:#fff}
.btn-success{background:var(--grn);color:#fff}.btn-success:hover{opacity:.88}
.btn-wa{background:#25D366;color:#fff}.btn-wa:hover{opacity:.88}
.btn-sm{padding:4px 10px;font-size:12px}.btn-xs{padding:2px 8px;font-size:11px;border-radius:5px}
.flex{display:flex;align-items:center;gap:8px}.gap4{gap:4px}

/* ── STATS ── */
.stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:12px;margin-bottom:20px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px}
.stat-lbl{font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.stat-val{font-size:24px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
.stat-sub{font-size:11px;color:var(--txt2);margin-top:4px}
.stat.acc .stat-val{color:var(--acc)}.stat.grn .stat-val{color:var(--grn)}
.stat.org .stat-val{color:var(--org)}.stat.red .stat-val{color:var(--red)}.stat.pur .stat-val{color:var(--pur)}

/* ── TABLES ── */
.tbl-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.tbl-wrap table{width:100%;border-collapse:collapse}
.tbl-wrap th{background:var(--card2);font-size:11px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;padding:9px 12px;text-align:left;white-space:nowrap;border-bottom:1px solid var(--border)}
.tbl-wrap td{padding:8px 12px;border-top:1px solid var(--border);font-size:13px;vertical-align:middle}
.tbl-wrap tr:hover td{background:rgba(26,58,107,.02)}
.tbl-empty{text-align:center;color:var(--txt3)!important;padding:40px!important;font-size:13px}

/* ── MODALS (CRM style) ── */
.modal-bg{position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-bg.hidden{display:none}
.modal{background:var(--card);border:1px solid var(--border);border-radius:12px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.15)}
.modal-hdr{padding:18px 20px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--card);z-index:1}
.modal-title{font-size:15px;font-weight:700}.modal-subtitle{font-size:11px;color:var(--txt2);margin-top:2px}
.modal-close{background:none;border:none;color:var(--txt2);font-size:20px;cursor:pointer;line-height:1;padding:2px 6px;border-radius:4px}
.modal-close:hover{background:var(--card2)}
.modal-body{padding:18px 20px}
.modal-footer{padding:14px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;position:sticky;bottom:0;background:var(--card)}
label.lbl{display:block;font-size:11px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
input,select,textarea{width:100%;background:var(--card2);border:1px solid var(--border);border-radius:6px;color:var(--txt);font-size:13px;padding:8px 10px;font-family:inherit;transition:border-color .12s}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--acc);background:#fff}
textarea{resize:vertical;min-height:70px}
select option{background:#fff}

/* ── .mover modals (sede-specific overlay) ── */
.mover{display:none;position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:200;align-items:center;justify-content:center;padding:20px}
.mover.open{display:flex}
.mover .modal{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;width:100%;max-width:500px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.15)}
.mover .modal h3{font-size:15px;font-weight:700;margin-bottom:14px}
.fg{margin-bottom:12px}.fg label{display:block;font-size:11px;font-weight:600;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
.fg input,.fg select,.fg textarea{width:100%;background:var(--card2);border:1px solid var(--border);border-radius:6px;color:var(--txt);font-size:13px;padding:8px 10px;font-family:inherit}
.fg input:focus,.fg select:focus{outline:none;border-color:var(--acc)}
.fgrow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mactions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}

/* ── SEDE COMPATIBILITY SHIMS ── */
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:12px;margin-bottom:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px}
.card .cl{font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.card .cv{font-size:22px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
.card .cs{font-size:11px;color:var(--txt2);margin-top:4px}
.card .cv.green{color:var(--grn)}.card .cv.red{color:var(--red)}.card .cv.yellow{color:var(--org)}
.tw{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;overflow-x:auto}
.tw table{width:100%;border-collapse:collapse}
.tw th{background:var(--card2);font-size:11px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;padding:9px 12px;text-align:left;white-space:nowrap;border-bottom:1px solid var(--border)}
.tw td{padding:8px 12px;border-top:1px solid var(--border);font-size:13px;vertical-align:middle}
.tw tr:hover td{background:rgba(26,58,107,.02)}
.sh{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.sh h2{font-size:16px;font-weight:700}
.chip{display:inline-block;background:var(--card2);border-radius:4px;padding:2px 6px;font-size:11px;color:var(--txt2);border:1px solid var(--border)}
.empty{text-align:center;color:var(--txt3);padding:40px;font-size:13px}
.alert{background:var(--org2);border:1px solid rgba(217,119,6,.3);border-radius:6px;padding:10px 13px;font-size:13px;color:var(--org);margin-bottom:14px}
.info{background:var(--acc2);border:1px solid rgba(26,58,107,.2);border-radius:6px;padding:10px 13px;font-size:13px;color:var(--acc);margin-bottom:14px}
.badge{display:inline-block;padding:2px 7px;border-radius:10px;font-size:11px;font-weight:600}
.bg-green{background:var(--grn2);color:var(--grn)}.bg-red{background:var(--red2);color:var(--red)}
.bg-yellow{background:var(--org2);color:var(--org)}.bg-gray{background:var(--card2);color:var(--txt2)}.bg-blue{background:var(--acc2);color:var(--acc)}
.tr{text-align:right}.bold{font-weight:600}.mb{margin-bottom:9px}
.green{color:var(--grn)}.red{color:var(--red)}.blue{color:var(--acc)}.yellow{color:var(--org)}
.cat-sel{padding:3px 6px;font-size:11px;border-radius:4px;border:1px solid var(--border);background:var(--card);color:var(--txt)}
.totrow td{font-weight:700;background:var(--acc2)!important;border-top:2px solid var(--acc)}

/* ── ACCOUNT CARDS ── */
.acct-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.acct-bank{font-size:11px;color:var(--txt2);font-weight:500}.acct-name{font-size:15px;font-weight:700;margin:3px 0}
.acct-details{font-size:12px;color:var(--txt2)}.acct-saldo{text-align:right}
.acct-saldo .sl{font-size:10px;color:var(--txt2);text-transform:uppercase;letter-spacing:.4px;font-weight:600}
.acct-saldo .sv{font-size:22px;font-weight:700}.acct-saldo .sa{font-size:11px;color:var(--txt2);margin-top:2px}

/* ── MENSALIDADES GRID ── */
.mens-wrap{overflow:hidden;background:var(--card);border:1px solid var(--border);border-radius:var(--r)}
.mt{border-collapse:collapse;width:100%;table-layout:fixed}
.mt th,.mt td{border:1px solid var(--border);padding:4px 2px;font-size:.68rem;text-align:center}
.mt th{background:var(--acc);color:#fff}.mt th:first-child{text-align:left;padding-left:8px}
.mt td:first-child{text-align:left;font-weight:500;background:var(--card2);padding:4px 6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mc{cursor:pointer}.mc:hover{background:var(--acc2)!important}
.mt .badge{padding:1px 4px;font-size:.63rem}

/* ── JOGOS CARDS ── */
.jcard{background:var(--card);border:1px solid var(--border);border-radius:var(--r);margin-bottom:9px;overflow:hidden}
.jch{background:var(--acc);color:#fff;padding:10px 13px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.jch .ji{font-size:.85rem;font-weight:600}
.jcb{padding:13px;display:none}.jcb.open{display:block}
.ctable{width:100%;border-collapse:collapse;margin-top:9px;font-size:.76rem}
.ctable th,.ctable td{padding:5px 8px;border:1px solid var(--border);text-align:center}
.ctable th{background:var(--card2);font-weight:600;color:var(--txt2)}.ctable td:first-child{text-align:left}

/* ── RECEBER BOX ── */
.receber-box{background:var(--card);border:1px solid var(--border);border-radius:var(--r);margin-bottom:14px;overflow:hidden}
.receber-head{background:#7f1d1d;color:#fff;padding:10px 14px;font-size:.88rem;font-weight:600}

/* ── MISC ── */
.prev-table{width:100%;border-collapse:collapse;font-size:.75rem;margin-top:10px;max-height:300px;overflow-y:auto;display:block}
.prev-table th,.prev-table td{padding:5px 8px;border:1px solid var(--border);white-space:nowrap}
.prev-table th{background:var(--card2);font-weight:600;color:var(--txt2);position:sticky;top:0}
.prev-select{border:1px solid var(--border);border-radius:4px;padding:2px 4px;font-size:.72rem;background:var(--card);color:var(--txt)}
.search-bar{display:flex;gap:10px;margin-bottom:18px}.search-bar input{max-width:320px}
.mb16{margin-bottom:16px}.mt8{margin-top:8px}

/* ── LOGIN SCREEN ── */
#loginScreen{position:fixed;inset:0;background:var(--acc);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px}
.login-box{background:var(--card);border-radius:16px;padding:32px 28px;width:100%;max-width:380px;text-align:center;border:1px solid var(--border)}
.login-logo{font-size:2.8rem;margin-bottom:6px}
.login-title{color:var(--acc);font-size:1.15rem;font-weight:700;margin-bottom:2px}
.login-sub{color:var(--txt2);font-size:.8rem;margin-bottom:24px}
.login-input{width:100%;border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:.9rem;outline:none;margin-bottom:10px;font-family:inherit;transition:border-color .2s;background:var(--card2);color:var(--txt)}
.login-input:focus{border-color:var(--acc);background:var(--card)}
.login-btn{width:100%;background:var(--acc);color:#fff;border:none;border-radius:8px;padding:10px;font-size:.92rem;font-weight:600;cursor:pointer;transition:opacity .15s;margin-top:4px}
.login-btn:hover{opacity:.88}.login-btn:disabled{opacity:.5;cursor:not-allowed}
.login-err{color:var(--red);font-size:.78rem;margin-top:10px;min-height:18px}
.login-role{font-size:.7rem;color:var(--txt2);margin-top:18px;line-height:1.6}

/* ── LOADING SCREEN ── */
#loadingScreen{position:fixed;inset:0;background:var(--acc);z-index:9998;display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:#fff}
.spinner{width:38px;height:38px;border:4px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── USER INFO (sidebar bottom) ── */
body.viewer .admin-only{display:none!important}
body.viewer .mc{cursor:default!important;pointer-events:none!important}

/* ── CALENDÁRIO SEDE ── */
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
.sc-sect-label:first-child{border-top:none;margin-top:0;padding-top:0}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* ── RESPONSIVE ── */
@media(max-width:700px){
  .main{margin-left:0;padding:14px}
  .sidebar{display:none}
  .sc-wrap{grid-template-columns:1fr}
  .sc-day-inner{height:72px}
  .cards{grid-template-columns:1fr 1fr}
  .fgrow{grid-template-columns:1fr}
  .acct-card{flex-direction:column;align-items:flex-start}
  .acct-saldo{text-align:left}
}

/* ── PRINT ── */
@media print{
  .sidebar,.page-hdr .btn,.btn-danger,.btn-ghost,.btn-warn,.btn-primary,.nav-badge{display:none!important}
  .main{margin-left:0!important;padding:8px!important}.page{display:block!important}
  body{background:#fff!important}.card,.tbl-wrap,.stat{border:1px solid #ccc!important;box-shadow:none!important}
  .tbl-wrap th{background:#f0f0f0!important;color:#000!important}
}
</style>`;

  html = html.slice(0, styleStart) + newStyle + html.slice(styleEnd);
  console.log('✅ Replaced entire <style> block');
}

// ─────────────────────────────────────────────
// STEP 2 — Replace <header> + <nav> block with sidebar
// ─────────────────────────────────────────────

const headerNavOld = `<header>
  <div class="hl"><h1>⚽ Sede Caixa Baixa</h1><p>Controle Financeiro</p></div>
  <div class="hr">
    <div class="bal">
      <div class="bl">Conta Bar</div>
      <div class="bv" id="hSaldoBar" onclick="showTab('bar')" title="Ir para Conta Bar">R$ 0,00</div>
    </div>
    <div class="bal">
      <div class="bl">Conta Holding</div>
      <div class="bv" id="hSaldoHolding" onclick="showTab('holding')" title="Ir para Conta Holding">R$ 0,00</div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
      <div class="user-chip" id="userInfo">—</div>
      <button class="logout-btn" onclick="fazerLogout()">Sair</button>
    </div>
  </div>
</header>

<nav>
  <button class="active" onclick="showTab('dashboard')">Dashboard</button>
  <button onclick="showTab('calendario')">Calendário</button>
  <button onclick="showTab('jogos')">Jogos</button>
  <button onclick="showTab('mensalidades')">Mensalidades</button>
  <button onclick="showTab('resumo')">Resumo Financeiro</button>
  <button onclick="showTab('comandas')">Comandas</button>
  <button onclick="showTab('bar')">Conta Bar</button>
  <button onclick="showTab('holding')">Conta Holding</button>
  <button onclick="showTab('membros')">Membros</button>
</nav>`;

const headerNavNew = `<nav class="sidebar" id="sidebar">
  <div class="brand">⚽ SEDE<small>Caixa Baixa · Financeiro</small></div>

  <div style="margin-top:8px;padding:8px 12px;background:var(--acc2);border-radius:var(--r);margin-bottom:4px">
    <div style="font-size:10px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Saldos</div>
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
      <span style="color:var(--txt2)">Conta Bar</span>
      <span id="hSaldoBar" style="font-weight:700;color:var(--grn);cursor:pointer" onclick="showTab('bar')">R$ 0,00</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:12px">
      <span style="color:var(--txt2)">Holding</span>
      <span id="hSaldoHolding" style="font-weight:700;color:var(--grn);cursor:pointer" onclick="showTab('holding')">R$ 0,00</span>
    </div>
  </div>

  <div class="nav-sep"></div>
  <div class="nav-grp">Visão Geral</div>
  <div class="nav-item active" data-tab="dashboard" onclick="showTab('dashboard')"><span class="ico">📊</span>Dashboard</div>
  <div class="nav-item" data-tab="calendario" onclick="showTab('calendario')"><span class="ico">📅</span>Calendário</div>

  <div class="nav-sep"></div>
  <div class="nav-grp">Membros</div>
  <div class="nav-item" data-tab="membros" onclick="showTab('membros')"><span class="ico">👥</span>Membros</div>
  <div class="nav-item" data-tab="mensalidades" onclick="showTab('mensalidades')"><span class="ico">💰</span>Mensalidades</div>

  <div class="nav-sep"></div>
  <div class="nav-grp">Financeiro</div>
  <div class="nav-item" data-tab="resumo" onclick="showTab('resumo')"><span class="ico">📈</span>Resumo Financeiro</div>
  <div class="nav-item" data-tab="bar" onclick="showTab('bar')"><span class="ico">🍺</span>Conta Bar</div>
  <div class="nav-item" data-tab="holding" onclick="showTab('holding')"><span class="ico">🏦</span>Conta Holding</div>

  <div class="nav-sep"></div>
  <div class="nav-grp">Eventos</div>
  <div class="nav-item" data-tab="jogos" onclick="showTab('jogos')"><span class="ico">⚽</span>Jogos</div>
  <div class="nav-item" data-tab="comandas" onclick="showTab('comandas')"><span class="ico">📋</span>Comandas</div>

  <div style="margin-top:auto">
    <div class="nav-sep"></div>
    <div style="padding:8px 12px;display:flex;flex-direction:column;gap:6px">
      <div id="userInfo" style="font-size:11px;color:var(--txt2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">—</div>
      <div id="userRole" style="font-size:10px;color:var(--txt3)"></div>
      <button class="btn btn-ghost btn-sm" style="width:100%;justify-content:center" onclick="fazerLogout()">Sair</button>
    </div>
  </div>
</nav>`;

replace('Replace <header>+<nav> with sidebar', headerNavOld, headerNavNew);

// ─────────────────────────────────────────────
// STEP 3 — Update <main> tag
// ─────────────────────────────────────────────

replace('Update <main> to <main class="main">', '<main>', '<main class="main">');

// ─────────────────────────────────────────────
// STEP 4 — Replace .tab-content with .page
// ─────────────────────────────────────────────

const tabContentActiveCount = (html.match(/class="tab-content active"/g) || []).length;
const tabContentCount = (html.match(/class="tab-content"/g) || []).length;

if (tabContentActiveCount === 0 && tabContentCount === 0) {
  console.error('❌ No .tab-content classes found');
  errors++;
} else {
  html = html.replace(/class="tab-content active"/g, 'class="page active"');
  html = html.replace(/class="tab-content"/g, 'class="page"');
  console.log(`✅ Replaced tab-content classes (active: ${tabContentActiveCount}, plain: ${tabContentCount})`);
}

// ─────────────────────────────────────────────
// STEP 5 — Update showTab function
// ─────────────────────────────────────────────

const showTabOld = `function showTab(name){
  currentTab=name;
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  document.querySelectorAll('nav button').forEach(b=>{
    if((b.getAttribute('onclick')||'').includes("'"+name+"'"))b.classList.add('active');
  });
  renderCurrentTab();atualizarHeader();
}`;

const showTabNew = `function showTab(name){
  currentTab=name;
  document.querySelectorAll('.page').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  document.querySelectorAll('.nav-item[data-tab="'+name+'"]').forEach(b=>b.classList.add('active'));
  renderCurrentTab();atualizarHeader();
}`;

replace('Update showTab() function', showTabOld, showTabNew);

// ─────────────────────────────────────────────
// STEP 6 — Update atualizarHeader function
// ─────────────────────────────────────────────

const atualizarHeaderOld = `function atualizarHeader(){
  if(!DB)return;
  const sb=calcSaldoBar(),sh=calcSaldoHolding();
  document.getElementById('hSaldoBar').textContent=brl(sb);
  document.getElementById('hSaldoHolding').textContent=brl(sh);
  document.getElementById('hSaldoBar').style.color=sb<0?'#fca5a5':'#fff';
  document.getElementById('hSaldoHolding').style.color=sh<0?'#fca5a5':'#fff';
}`;

const atualizarHeaderNew = `function atualizarHeader(){
  if(!DB)return;
  const sb=calcSaldoBar(),sh=calcSaldoHolding();
  const elBar=document.getElementById('hSaldoBar');
  const elHold=document.getElementById('hSaldoHolding');
  if(elBar){elBar.textContent=brl(sb);elBar.style.color=sb<0?'var(--red)':'var(--grn)';}
  if(elHold){elHold.textContent=brl(sh);elHold.style.color=sh<0?'var(--red)':'var(--grn)';}
}`;

replace('Update atualizarHeader() function', atualizarHeaderOld, atualizarHeaderNew);

// ─────────────────────────────────────────────
// STEP 7 — Fix login screen old CSS variable references
// ─────────────────────────────────────────────

// Fix the maps link in dashboard that uses var(--ba)
const mapsLinkOld = `style="font-size:.7rem;color:var(--ba);margin-top:4px;text-decoration:none"`;
const mapsLinkNew = `style="font-size:.7rem;color:var(--acc);margin-top:4px;text-decoration:none"`;
if (html.includes(mapsLinkOld)) {
  html = html.replace(mapsLinkOld, mapsLinkNew);
  console.log('✅ Fixed var(--ba) in maps link');
} else {
  console.log('ℹ️  Maps link var(--ba) not found (may already be updated)');
}

// Fix any remaining old var references that may appear in inline styles
const oldVarReplacements = [
  ['var(--bd)',  'var(--acc)'],
  ['var(--bl)',  'var(--acc)'],
  ['var(--ba)',  'var(--acc)'],
  ['var(--g)',   'var(--card2)'],
  ['var(--g2)',  'var(--border)'],
  ['var(--g5)',  'var(--txt2)'],
  ['var(--g7)',  'var(--txt)'],
  ['var(--gn)',  'var(--grn)'],
  ['var(--rd)',  'var(--red)'],
  ['var(--yw)',  'var(--org)'],
];

// Only replace inside inline style attributes (not inside <style> blocks which we already replaced)
// Strategy: replace all occurrences left in the HTML body (outside the style block we already set)
let inlineVarCount = 0;
for (const [oldVar, newVar] of oldVarReplacements) {
  const regex = new RegExp(oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const before = html.length;
  html = html.replace(regex, newVar);
  const changed = (before !== html.length) || html.includes(newVar);
  // Count actual replacements
  const matches = (html.match(new RegExp(oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (matches > 0) {
    console.warn(`⚠️  ${matches} occurrence(s) of ${oldVar} still remain after replacement attempt`);
  } else {
    inlineVarCount++;
  }
}
console.log(`✅ Old CSS variable cleanup complete (${inlineVarCount}/${oldVarReplacements.length} fully replaced)`);

// ─────────────────────────────────────────────
// FINAL VERIFICATION
// ─────────────────────────────────────────────

console.log('\n── Verification ──');
console.log('.page class found:',         html.includes('class="page"') || html.includes('class="page active"'));
console.log('.sidebar found:',            html.includes('class="sidebar"'));
console.log('.main found:',               html.includes('class="main"'));
console.log('showTab updated:',           html.includes("querySelectorAll('.page')"));
console.log('atualizarHeader updated:',   html.includes("'var(--red)':'var(--grn)'") || html.includes("var(--grn)"));
console.log('hSaldoBar is <span>:',       html.includes('<span id="hSaldoBar"'));
console.log('hSaldoHolding is <span>:',   html.includes('<span id="hSaldoHolding"'));
console.log('No old .tab-content left:',  !html.includes('tab-content'));
console.log(`HTML size: ${html.length} bytes (was ${originalSize})`);

// ─────────────────────────────────────────────
// WRITE OUTPUT
// ─────────────────────────────────────────────

writeFileSync(SRC, html, 'utf8');
console.log(`\n✅ Written to ${SRC}`);

if (errors > 0) {
  console.error(`\n⚠️  ${errors} replacement(s) failed — review the log above`);
  process.exit(1);
} else {
  console.log('All replacements succeeded.');
}

import { readFileSync, writeFileSync } from 'fs';

// ─── Parse Batuta's spreadsheet ───
const raw = `André Toribio Leão,LEÃO,quitado,quitado,quitado,quitado,quitado,,,,,,
Antonio Pietro Almeida,TONINHO,I,I,I,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Ariel Ribeiro Carvalho,ARIEL,I,I,I,,,,,,,,
Augusto O. Conte Junior,GUTO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Bibiana S Schlabitz,BIBI,quitado,quitado,quitado,quitado,quitado,,,,,,
Brayan Gonçalves Souza da Silva,BRAYAN,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Bruno Ajala Fernandes,AJALA,quitado,quitado,quitado,quitado,quitado,,,,,,
Carjan Salerno Rocha,CARJAN,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Carlos Roberto Tavares de Souza Junior,COSTELINHA,X,X,X,,,,,,,,
Christian Martins Toschi,MENDIGO,quitado,quitado,quitado,quitado,quitado,,,,,,
Diego de Andrade Nunez,MESTRE,quitado,quitado,quitado,quitado,quitado,quitado,,,,,,
Eduarda Bonometti Sturmer,DUDA,quitado,quitado,quitado,quitado,quitado,,,,,,
Eduardo Liberato Tettamanzy,CEBOLA,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Eduardo Portella dos Santos,PORTELLA,I,I,I,quitado,,,,,,,,
Emanuel Gheno Bagatini,EMANUEL,X,X,X,quitado,quitado,,,,,,
Fabricio Nascimento,PEREA,,,,,,,,,,,,
Felipe Pereira Outeiro,OUTEIRO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,
Felipe Schuster Giraffa,GIRAFFA,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,
Felipe Steemburgo Azevedo,HARRY,I,I,I,quitado,quitado,quitado,quitado,,,,
Filipe Caregnato Garcia,FIGO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Gabriel Emil Cauduro,CAUDURO,quitado,quitado,quitado,quitado,quitado,,,,,,
Guilherme Dresch da Silveira Jacques,GUIGO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Guilherme Pietro Almeida,MALVADINHO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Gustavo Oliveira de Oliveira,DIMENOR,quitado,quitado,quitado,quitado,,,,,,,
Heitor Ribeiro,HEITOR,X,X,X,X,quitado,quitado,quitado,,,,,
Helio de Brites Giumelli,HELIO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Henrique Saldanha da Cunha,URSÃO,quitado,quitado,quitado,quitado,quitado,,,,,,
Henrique Silva de Oliveira,MAJOR,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Jackson de Moraes Prado,JACKSON,I,I,I,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
João Dutra Fischer,FISCHER,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
João Henrique de Oliveira Paz,DIMAIOR,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
João Machado Schueler,XULER,quitado,quitado,quitado,quitado,,,,,,,
João Pedro Silveira Viana,JOTA,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,
João Vicente Rech Garibaldi,COQUE,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,
Juan Silva Cunda,CUNDA,quitado,quitado,quitado,quitado,quitado,,,,,,
LÉO DO MANGO,LÉO DO MANGO,X,X,X,X,quitado,quitado,quitado,,,,,
Leonardo Santos da Costa,LÉO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Lucas da Fonseca Machado,COXA,quitado,quitado,quitado,quitado,quitado,,,,,,
Lucas Mendes,MENDES,quitado,quitado,quitado,quitado,,,,,,,
Lucas Scalabrin Amaral,AMARAL,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Lucca Isoton Alapont,PALMITO,quitado,quitado,quitado,quitado,,,,,,,
Luiggi G Moraes Bertaco,LUIGGI,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Luísa de Castro e Garcia,LUISA,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Luiz Eduardo Nobre da Silva Junior,LUIZ,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Manuela Requena de Lima,MANU,quitado,quitado,X,X,X,,,,,,
Marco Rafaelo Pisoni,MARKITO,quitado,quitado,quitado,quitado,quitado,,,,,,
Marcus Vinicius Coelho Leite,NARCOS,quitado,quitado,quitado,quitado,quitado,,,,,,
Mariana dos Santos Whidolzer,MARI W,quitado,quitado,quitado,quitado,,,,,,,
Mariana Flores Pinto,MARINHAS,X,X,quitado,quitado,quitado,,,,,,
Mario Sergio da Rosa Junior,MARIO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Mauricio Pinto Szapszay,ZAP,I,I,I,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Mauricio Pradie Peixoto,PEIXOTO,I,I,I,quitado,quitado,quitado,quitado,quitado,quitado,,,
Mauricio Thurow Levien,EUDINE,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Pedro Carpes de Camargo,ANÃO,quitado,quitado,quitado,quitado,quitado,,,,,,
Pedro Costa de Barros,PC,quitado,quitado,quitado,quitado,quitado,,,,,,
Pedro Emílio Bazzanella de Azevedo,PEDRO EMÍLIO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Pedro Henrique Nogueira de Araújo,PEDRÃO,quitado,,quitado,quitado,,,,,,,
Pedro Malta da Cunha Medeiros,MONGE,quitado,quitado,quitado,quitado,quitado,,,,,,
Rhuan Luigi Ramos Borges de Nogueira,RHUAN,X,X,X,quitado,quitado,,,,,,
Rodrigo Heidrich da Silva Schaefer,SCHAEFER,quitado,quitado,quitado,quitado,quitado,,,,,,
Thales da Silva,XUXA,X,X,X,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Thomaz Gomes Baldissera,THOMAZINHO,quitado,quitado,quitado,quitado,quitado,quitado,quitado,,,,,
Vinicius Caregnato Garcia,VINI,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Vinicius Nicolodelli Testoni,TESTONI,I,I,I,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado
Wellison de Moraes Prado,LERO,quitado,quitado,quitado,quitado,,,,,,,
Yan Mussnich Rotta Gomes de Assunção,BATUTA,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado,quitado`;

const MESES_KEYS = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06',
                    '2026-07','2026-08','2026-09','2026-10','2026-11','2026-12'];
const STATUS_MAP = { 'quitado':'pago', 'i':'isento', 'x':'fora', '':'' };

const BATUTA_MEMBERS = [];
let uid_counter = 1000;
function uid_b() { return 'b' + (Date.now().toString(36) + (uid_counter++).toString(36)).slice(0,14); }

raw.split('\n').forEach(line => {
  const cols = line.split(',');
  if(cols.length < 2) return;
  const nome = cols[0].trim();
  const apelido = cols[1].trim();
  if(!nome && !apelido) return;
  const nomeDisplay = nome || apelido;

  const meses = {};
  MESES_KEYS.forEach((mk, i) => {
    const v = (cols[i+2] || '').trim().toLowerCase();
    const status = STATUS_MAP[v] || '';
    if(status) meses[mk] = status;
  });

  // Determine member status
  const vals = Object.values(meses);
  const isAllIsento = vals.length > 0 && vals.every(v => v === 'isento');
  const memberStatus = isAllIsento ? 'isento_fixo' : 'ativo';

  // First paid month as "desde"
  const primeiroPago = MESES_KEYS.find(mk => meses[mk] === 'pago') || '';

  BATUTA_MEMBERS.push({
    id: uid_b(),
    nome: nomeDisplay,
    apelido,
    status: memberStatus,
    desde: primeiroPago,
    meses // stored separately
  });
});

console.log('Members parsed:', BATUTA_MEMBERS.length);

// Stats
const totalMesesPagos = BATUTA_MEMBERS.reduce((s,m) => s + Object.values(m.meses).filter(v=>v==='pago').length, 0);
const totalMesesIsentos = BATUTA_MEMBERS.reduce((s,m) => s + Object.values(m.meses).filter(v=>v==='isento').length, 0);
console.log('Total meses quitados:', totalMesesPagos);
console.log('Total meses isentos:', totalMesesIsentos);

// Generate the import data (members + mensalidades) as JSON
const importData = {
  members: BATUTA_MEMBERS.map(({id,nome,apelido,status,desde}) => ({id,nome,apelido,status,desde})),
  mensalidades: Object.fromEntries(BATUTA_MEMBERS.map(m => [m.id, m.meses]))
};

writeFileSync('C:/Users/mauri/Downloads/batuta_import.json', JSON.stringify(importData, null, 2));
console.log('Written batuta_import.json');

// Also write compact version for HTML embedding
const compact = JSON.stringify(importData);
console.log('Compact size:', compact.length, 'bytes');
writeFileSync('C:/Users/mauri/Downloads/batuta_compact.json', compact);

# CLAUDE.md — Sede Caixa Baixa

Este arquivo fornece contexto completo ao Claude Code para continuar o desenvolvimento do sistema financeiro da Sede Caixa Baixa.

---

## O Projeto

Sistema financeiro web em arquivo único HTML (`sede-financeiro.html`) para gestão da sede do grupo de amigos que se reúne nos jogos do Grêmio.

**Arquivo principal:** `C:\Users\mauri\Downloads\CLAUD - SEDE\sede-financeiro.html`

---

## Contexto da Sede

- Sede comprada pelos amigos para se reunir em dias de jogos do Grêmio (POA e fora)
- Tem um bar para cobrir os custos de manutenção
- Endereço: **Rua Luiz Carlos Pinheiro Cabral, 201 - Farrapos, Porto Alegre - RS, 90250-500**

### Cardápio do Bar
- Brahma (litro): R$ 15,00
- Heineken (600 ml): R$ 18,00
- Fernet (copo): R$ 20,00
- Refrigerante (350 ml): R$ 6,00
- Água com/sem gás (500 ml): R$ 5,00

### Mensalidades
- Valor: R$ 30,00/mês por membro
- Status possíveis: valor pago (ex: "R$ 30,00"), "isento", "fora"
- "fora" = entrou no grupo após aquela competência
- "isento" = isentado por responsabilidade (bar, financeiro, churrasco, abastecimento)
- A partir de abril/2026 registra-se o valor (R$ 30,00) em vez de "quitado" para permitir somatório
- Pagamento via **PicPay Empresas** (conta separada da conta bar)
- Controle feito pelo **Batuta** — planilha em: `G:\Meu Drive\Mauricio Szapszay\Documentos\Caixa Baixa\Caixa Baixa\05 - FINANCEIRO\Mensalidades.xlsx`
- 66 membros cadastrados, 412 meses pagos, 24 isentos (dados importados do Batuta)

### Comandas
- Sócios-fundadores (quem aportou na compra da casa) podem consumir e pagar depois
- Controle por comandas pós-jogo
- Apuração individual após cada evento
- Controle de comandas do Batuta: `G:\Meu Drive\Mauricio Szapszay\Documentos\Caixa Baixa\Caixa Baixa\05 - FINANCEIRO\COMANDAS\Comandas .xlsx`

### Despesas Fixas Mensais
- Conta de luz (CEE)
- Conta de água (DMAE)
- Internet
- Compra de bebidas (cervejas, fernet, água, refrigerante)
- Aluguel simbólico de R$ 800,00 (para amortizar o investimento da compra)
- Faxina

---

## Contas Bancárias

### Conta Bar (receitas e despesas operacionais)
- Banco: **CloudWalk / InfinitePay**
- CNPJ: 60.982.530/0001-04
- Agência: 0001
- Conta Corrente: 187038

### Conta Holding / Mensalidades (PicPay)
- Nome: **CXBX Patrimonial** (ou similar)
- Banco: PicPay Empresas
- Usada exclusivamente para recebimento de mensalidades

---

## Estrutura do Sistema (`sede-financeiro.html`)

Layout com sidebar à esquerda, estilo idêntico ao CRM pessoal do Maurício (mesmo CSS, mesmas convenções visuais).

### Abas da Sidebar
1. **📊 Dashboard** — KPIs (Saldo Bar, Saldo Holding, Mensalidades do mês, Comandas pendentes), Informações da Sede (endereço + contas), Checklist de pendências do mês
2. **🏦 Conta Bar** — Extrato mensal (pill tabs por mês), importação via PDF/Excel da InfinitePay
3. **🏦 Conta Holding** — Extrato mensal (pill tabs por mês), importação via PicPay
4. **👥 Mensalidades** — Grid de membros × meses, botão "Importar Batuta", reconciliação com Holding
5. **🎮 Comandas** — Controle de consumo por jogo, lançamento individual por membro
6. **📦 Estoque** — Controle de estoque de bebidas e insumos
7. **📅 Calendário** — Jogos do Grêmio e Seleção Brasileira, layout idêntico ao CRM (tabs de mês, grade 7×6, painel de detalhe + legenda)

### Título do Sistema
- Header/sidebar: **SEDE CAIXA BAIXA** (maiúsculas) com "Financeiro" abaixo em letras menores
- Aba do navegador: **Sede Caixa Baixa — Financeiro**

---

## Fontes Confiáveis para Jogos
- Jogos do Grêmio: site oficial do Grêmio e CBF
- Seleção Brasileira: site da CBF (cbf.com.br)
- Competições internacionais: site da Conmebol (conmebol.com)

---

## Arquivos de Referência
| Arquivo | Caminho |
|---|---|
| Sistema principal | `C:\Users\mauri\Downloads\CLAUD - SEDE\sede-financeiro.html` |
| Mensalidades (Batuta) | `G:\Meu Drive\Mauricio Szapszay\Documentos\Caixa Baixa\Caixa Baixa\05 - FINANCEIRO\Mensalidades.xlsx` |
| Comandas (Batuta) | `G:\Meu Drive\Mauricio Szapszay\Documentos\Caixa Baixa\Caixa Baixa\05 - FINANCEIRO\COMANDAS\Comandas .xlsx` |
| Organograma operacional | `G:\Meu Drive\Mauricio Szapszay\Documentos\Caixa Baixa\Caixa Baixa\06 - OPERACIONAL\Organograma operacional.xlsx` |
| Extrato Conta Bar (xlsx) | `C:\Users\mauri\Downloads\CLAUD - SEDE\Documento 04 - Extrato Conta Bar.xlsx` |

---

## Convenções de Desenvolvimento

- **Tudo em arquivo único HTML** — sem frameworks externos, sem servidor backend
- **localStorage** para persistência de dados (mesmo padrão do CRM)
- **Mesmo estilo visual do CRM pessoal** do Maurício (variáveis CSS iguais: --acc, --grn, --red, --bg, --card, --border, etc.)
- Datas no formato brasileiro (DD/MM/AAAA)
- Valores em Real (R$) com vírgula decimal
- Sidebar fixa à esquerda, conteúdo principal com `margin-left: var(--sw)`
- Verificar sintaxe JS antes de entregar qualquer alteração

---

## Pessoas-Chave
- **Maurício** — dono do projeto, usa este Claude Code
- **Batuta** — responsável pelo controle de mensalidades e comandas (mantém planilhas no Google Drive)
- Outros sócios-fundadores — podem consumir no bar via comanda

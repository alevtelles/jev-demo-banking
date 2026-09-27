# Jev: demo de atendimento bancário

Exemplos de uso do Jev, o motor de julgamento estruturado da TypeSafe, com o SDK TypeScript (`@typesafe-ai/sdk`), aplicados a um cenário fictício de SAC de cartão de crédito: o **Banco Aurora** e seu cartão em duas categorias, Aurora Black e Aurora Classic.

Quer o artigo completo, com a explicação de cada padrão? Veja [`_docs/cenario.md`](_docs/cenario.md).

Quer criar o projeto do zero, entender cada dependência ou rodar tudo em Docker? Veja [`_docs/setup.md`](_docs/setup.md).

## Configuração

Requisitos: Node.js 22+, acesso à TypeSafe e uma chave de API.

```sh
npm ci
cp .env.example .env
```

Adicione sua chave de API da TypeSafe ao `.env`. O arquivo é ignorado pelo Git.

## Boas práticas com o Jev (e erros a evitar)

Os cenários estão agrupados em três partes: preparar o estado, escrever as
perguntas, e usar as respostas no seu código. Cada cenário tem sua própria pasta,
e os arquivos dentro dela são numerados na ordem em que devem ser executados.

Rode qualquer arquivo com o script `scenario`:

```sh
npm run scenario 1-estado/01-chamado-cartao-com-defeito/001-texto-corrido.ts
```

Cada pasta leva o nome do caso de atendimento do Banco Aurora que ela usa para ensinar um conceito do Jev. O conceito em si está na coluna "O que aprendemos".

### 1. Estado

| Pasta | Caso do Banco Aurora | O que aprendemos |
|---|---|---|
| `01-chamado-cartao-com-defeito` | Cliente relata que o cartão não é lido na maquininha | O estado deve ser texto puro ou um objeto? |
| `02-ligacao-com-pedido-de-estorno` | Ligação: troca de endereço, cartão com defeito, estorno e cancelamento de cartão adicional | Como devemos estruturar o estado? |
| `03-cobertura-da-garantia-do-cartao` | Segunda via gratuita conforme os meses desde a emissão do cartão | Devemos preparar o estado antes de enviá-lo? |
| `04-frustracao-no-historico-de-chamados` | Histórico de chamados anteriores do cliente vs. só o chamado atual | Quanta informação devemos incluir no estado? |

### 2. Perguntas

| Pasta | Caso do Banco Aurora | O que aprendemos |
|---|---|---|
| `01-roteamento-por-time` | Encaminhar um chamado para cobranças, emissão, acesso ou funcionamento | Quando usar Noul ou Choice? |
| `02-intensidade-da-frustracao` | Medir o quanto o cliente está frustrado com um cartão que dá defeito | Quando usar Score em vez de Noul? |
| `03-sinais-de-escalonamento` | Pedido de supervisor, ameaça de cancelamento, menção a Procon/BACEN | Estamos pedindo ao Jev para julgar muitas coisas de uma vez? |
| `04-criterio-de-julgamento` | Estorno, roteamento por time e frustração, com e sem critério explícito | Deixamos claro o que cada resposta deve significar? |
| `05-triagem-completa-em-uma-chamada` | Sete julgamentos sobre o mesmo chamado urgente de cartão | Mais perguntas significam mais chamadas de API? |
| `06-email-para-envio-da-fatura` | Escolher, entre candidatos extraídos da mensagem, o e-mail para enviar a fatura | Como o Jev pode nos ajudar a extrair um valor, se ele não gera texto? |

### 3. Respostas

| Pasta | Caso do Banco Aurora | O que aprendemos |
|---|---|---|
| `01-roteamento-de-chamados-por-regra` | Rotear 5 chamados (defeito, emissão, cancelamento) para a ação certa | Quem deve tomar a decisão final, o Jev ou nosso código? |
| `02-confianca-para-agir-automaticamente` | Roteamento por time e probabilidade de estorno, com limiares de confiança | Nosso código deve confiar em toda resposta? |
| `03-quanto-de-confianca-para-estornar` | Estorno automático vs. sugerir resposta, segundo o risco da ação | Toda ação precisa do mesmo nível de confiança? |
| `04-fila-priorizada-de-chamados` | Priorizar uma fila de chamados combinando impacto, frustração e categoria do cartão | Como transformamos várias respostas em uma única decisão? |
| `05-estorno-com-jev-indisponivel` | O mesmo roteador de estorno, mas o Jev falha (timeout, 5xx) | O que o código faz quando o Jev não responde? |
| `06-evento-de-decisao-com-chave-idempotente` | Registrar uma decisão de estorno sob uma chave de idempotência | Como evito duplicar uma ação financeira num retry? |

Os resultados são reais, não simulados, então os números variam levemente entre
execuções. Os limiares e pesos usados nesses arquivos são exemplos. Escolha os
seus testando mensagens do seu próprio atendimento.

## Exemplos introdutórios

Os dois arquivos na raiz são a introdução ao Jev.

```sh
npm run frustration-check
```

`frustration-check.ts` pergunta se uma mensagem de cliente expressa frustração.

```sh
npm run combined-judgment
```

`combined-judgment.ts` envia perguntas Noul, Choice e Score juntas, e usa um
limiar de exemplo para decidir se a mensagem deve ser marcada para revisão.

## Verificação de tipos

```sh
npm run check
```

## Docker

```sh
docker build -t jev-demo-banking .
docker run --rm -v "$(pwd)/.env:/app/.env:ro" jev-demo-banking
```

Detalhes, variações de comando e a execução sem montar arquivo estão em [`_docs/setup.md`](_docs/setup.md).

Docs: https://docs.typesafe.ai/sdk/javascript

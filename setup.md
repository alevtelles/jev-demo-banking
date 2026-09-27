# Setup do Projeto: Criar, Configurar e Rodar

Este guia cobre o caminho completo: criar o projeto do zero (ou clonar este repositório), instalar as bibliotecas, configurar a chave de API da TypeSafe, rodar os exemplos e, como bônus, empacotar tudo num container Docker.

## Pré-requisitos

- **Node.js 22 ou superior** (`node -v`). O `package.json` declara `"engines": { "node": ">=22" }`.
- **npm** (vem com o Node).
- Uma **chave de API da TypeSafe**. Sem ela, os exemplos rodam até a chamada ao Jev e param com uma mensagem explicando o que falta.
- **Docker** (opcional, só para a seção de bônus).

## Criando o projeto do zero

Se você quiser entender exatamente como este projeto é montado, ou replicar a mesma base para outro cenário, comece por um diretório vazio:

```sh
mkdir meu-projeto-jev && cd meu-projeto-jev
npm init -y
```

Abra o `package.json` gerado e ajuste três coisas: o modo de módulo, a versão mínima do Node, e os scripts que você vai usar para rodar arquivos `.ts` diretamente (sem precisar de um passo de build separado):

```json
{
  "name": "meu-projeto-jev",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22"
  }
}
```

### Instalando as bibliotecas

Duas categorias de dependência: o SDK da TypeSafe (o que o código realmente usa em produção) e as ferramentas de desenvolvimento (TypeScript, o executor `tsx`, e os tipos do Node):

```sh
npm install @typesafe-ai/sdk
npm install --save-dev typescript tsx @types/node
```

Isso deixa o `package.json` com:

```json
{
  "dependencies": {
    "@typesafe-ai/sdk": "^0.6.0"
  },
  "devDependencies": {
    "@types/node": "^26.6.2",
    "tsx": "^4.23.13",
    "typescript": "^7.0.2"
  }
}
```

`tsx` é o que permite rodar um arquivo `.ts` diretamente (`tsx arquivo.ts`) sem compilar para `.js` primeiro. É por isso que não há passo de build neste projeto, só verificação de tipos.

### Configurando o TypeScript

Crie um `tsconfig.json` na raiz. Este projeto usa `noEmit: true` porque `tsx` já cuida de executar o TypeScript em tempo real. O `tsc` aqui serve só para checar tipos, não para gerar `.js`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["**/*.ts"]
}
```

### Adicionando os scripts de execução

De volta ao `package.json`, adicione os scripts que amarram tudo. É exatamente isto que está em `package.json` neste repositório:

```json
{
  "scripts": {
    "frustration-check": "tsx --env-file=.env frustration-check.ts",
    "combined-judgment": "tsx --env-file=.env combined-judgment.ts",
    "check": "tsc --noEmit",
    "scenario": "tsx --env-file=.env"
  }
}
```

`--env-file=.env` faz o Node carregar as variáveis do arquivo `.env` antes de rodar o script — é assim que a chave de API chega até o código sem nunca ser escrita no código-fonte. O script `scenario` não tem um arquivo fixo: ele espera o caminho como argumento (`npm run scenario <caminho-do-arquivo>`), o que é o que permite rodar qualquer um dos exemplos numerados sem precisar de um script novo para cada um. Veja a estrutura de pastas abaixo.

## Ou: clonando este repositório

Se você só quer rodar os exemplos deste projeto específico (triagem de atendimento do Banco Aurora com Jev), o caminho é mais curto: tudo acima já está montado:

```sh
git clone <url-do-repositorio>
cd jev-demo-banking
npm ci
```

`npm ci` (em vez de `npm install`) instala exatamente as versões travadas no `package-lock.json`, o que é o que você quer tanto localmente quanto dentro de uma imagem Docker.

## Estrutura de pastas

Esta é a árvore real do projeto: os dois arquivos-exemplo na raiz, os três estágios do tutorial (`1-estado/`, `2-perguntas/`, `3-respostas/`, cada um com suas subpastas nomeadas pelo caso de atendimento do Banco Aurora que demonstram), a documentação e os arquivos de configuração:

```
jev-demo-banking/
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── frustration-check.ts
├── combined-judgment.ts
├── _docs/
│   ├── cenario.md
│   └── setup.md
├── 1-estado/
│   ├── 01-chamado-cartao-com-defeito/
│   │   ├── 001-texto-corrido.ts
│   │   └── 002-objeto-estruturado.ts
│   ├── 02-ligacao-com-pedido-de-estorno/
│   │   ├── 001-transcricao-em-texto.ts
│   │   ├── 002-agrupado-por-falante.ts
│   │   └── 003-fala-a-fala.ts
│   ├── 03-cobertura-da-garantia-do-cartao/
│   │   ├── 001-datas-brutas.ts
│   │   └── 002-calculado-no-codigo.ts
│   └── 04-frustracao-no-historico-de-chamados/
│       ├── 001-historico-completo.ts
│       └── 002-somente-chamado-atual.ts
├── 2-perguntas/
│   ├── 01-roteamento-por-time/
│   │   ├── 001-nouls-por-time.ts
│   │   ├── 002-choice-de-time.ts
│   │   ├── 003-choice-de-tag.ts
│   │   ├── 004-nouls-de-tag.ts
│   │   ├── 005-sem-opcao-outro.ts
│   │   └── 006-com-opcao-outro.ts
│   ├── 02-intensidade-da-frustracao/
│   │   ├── 001-frustracao-com-noul.ts
│   │   ├── 002-frustracao-com-score.ts
│   │   └── 003-baixa-media-alta.ts
│   ├── 03-sinais-de-escalonamento/
│   │   ├── 001-escalonamento-generico.ts
│   │   ├── 002-sinais-separados.ts
│   │   └── 003-condicao-composta.ts
│   ├── 04-criterio-de-julgamento/
│   │   ├── 001-estorno-sem-criterio.ts
│   │   ├── 002-estorno-com-criterio.ts
│   │   ├── 003-criterio-simples.ts
│   │   ├── 004-criterio-estruturado.ts
│   │   ├── 005-niveis-em-frase.ts
│   │   └── 006-niveis-estruturados.ts
│   ├── 05-triagem-completa-em-uma-chamada/
│   │   ├── 001-uma-chamada-por-pergunta.ts
│   │   └── 002-todas-em-uma-chamada.ts
│   └── 06-email-para-envio-da-fatura/
│       └── 001-escolher-o-email.ts
└── 3-respostas/
    ├── 01-roteamento-de-chamados-por-regra/
    │   └── 001-rotear-chamados.ts
    ├── 02-confianca-para-agir-automaticamente/
    │   ├── 001-confianca-do-choice.ts
    │   └── 002-probabilidade-do-noul.ts
    ├── 03-quanto-de-confianca-para-estornar/
    │   └── 001-responder-ou-estornar.ts
    ├── 04-fila-priorizada-de-chamados/
    │   └── 001-prioridade-com-peso.ts
    ├── 05-estorno-com-jev-indisponivel/
    │   └── 001-fail-closed.ts
    └── 06-evento-de-decisao-com-chave-idempotente/
        └── 001-registrar-decisao.ts
```

Cada subpasta numerada (`01-...`, `02-...`) demonstra um conceito específico do Jev; os arquivos numerados dentro dela (`001-...`, `002-...`) são variações do mesmo caso, na ordem em que faz sentido lê-los. Nenhum arquivo importa outro por caminho relativo (cada um só importa `@typesafe-ai/sdk`), então é seguro rodar, mover ou usar qualquer um deles isoladamente com `npm run scenario <caminho>`. O detalhe de qual conceito cada pasta ensina está na tabela do `README.md`.

## Configurando a chave de API

O repositório nunca contém uma chave de API real: `.env` está no `.gitignore`, e só o `.env.example` (com o nome da variável, sem valor) é versionado:

```sh
cp .env.example .env
```

Abra `.env` e preencha:

```
TYPESAFE_API_KEY=sua-chave-aqui
```

Se você rodar qualquer exemplo sem preencher isso, o próprio código avisa e para, em vez de falhar com um erro genérico: é a mensagem "Adicione sua chave de API da TypeSafe ao .env antes de rodar este exemplo." que aparece em `frustration-check.ts` e `combined-judgment.ts`.

## Rodando os exemplos

Com dependências instaladas e a chave configurada:

```sh
# Os dois exemplos introdutórios, na raiz do projeto
npm run frustration-check
npm run combined-judgment

# Qualquer arquivo de exemplo dentro de 1-estado/, 2-perguntas/ ou 3-respostas/
npm run scenario 1-estado/01-chamado-cartao-com-defeito/002-objeto-estruturado.ts
npm run scenario 3-respostas/04-fila-priorizada-de-chamados/001-prioridade-com-peso.ts

# Só verificar os tipos, sem fazer nenhuma chamada de rede
npm run check
```

Os resultados de qualquer exemplo que chama o Jev são reais, não simulados: as respostas variam levemente entre execuções, porque vêm de uma chamada de verdade à API.

## Bônus: empacotando em Docker

O repositório inclui um `Dockerfile` e um `.dockerignore` na raiz, testados nesta sessão (build e execução em container, com e sem chave de API). A imagem instala as dependências, copia o código, roda `npm run check` como parte do próprio build (se o TypeScript não compilar, a imagem nem termina de ser construída) e roda como um usuário sem privilégios, não como root.

### Construindo a imagem

```sh
docker build -t jev-demo-banking .
```

### Rodando um exemplo no container

A chave de API **nunca** é copiada para dentro da imagem: o `.dockerignore` exclui qualquer `.env`, mantendo só o `.env.example` como referência. Para rodar um exemplo de verdade, monte seu `.env` local dentro do container em tempo de execução:

```sh
docker run --rm -v "$(pwd)/.env:/app/.env:ro" jev-demo-banking
```

Isso roda o comando padrão da imagem (`npm run frustration-check`) exatamente como rodaria localmente, usando o `.env` montado como somente leitura (`:ro`).

Para rodar um exemplo diferente do padrão:

```sh
docker run --rm -v "$(pwd)/.env:/app/.env:ro" jev-demo-banking \
  npm run scenario 3-respostas/04-fila-priorizada-de-chamados/001-prioridade-com-peso.ts
```

### Alternativa sem montar arquivo

Se preferir não montar um arquivo dentro do container, passe a chave direto como variável de ambiente do Docker e chame `tsx` diretamente, sem a flag `--env-file` do `npm run`:

```sh
docker run --rm -e TYPESAFE_API_KEY=sua-chave-aqui jev-demo-banking \
  npx tsx frustration-check.ts
```

As duas formas foram testadas nesta sessão: a primeira reproduz a mensagem de aviso quando a chave está vazia; a segunda, com uma chave de teste, chegou de verdade até a API da TypeSafe e recebeu um erro de autenticação (401), prova de que a rede e o SDK dentro do container funcionam ponta a ponta, faltando só uma chave real.

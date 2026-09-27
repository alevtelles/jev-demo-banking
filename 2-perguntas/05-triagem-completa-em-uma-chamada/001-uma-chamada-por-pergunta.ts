import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  cliente: { nome: "Marina", cartao: "Aurora Black" },
  emissao: { produto: "Cartão de crédito Aurora Black", emitido: "3 semanas atrás" },
  mensagem:
    "Oi, meu cartão Aurora parou de ser lido na maquininha. A luz do chip nem acende, e já testei em duas maquininhas diferentes. " +
    "Uso ele todos os dias para o trabalho, então eu realmente gostaria que isso fosse resolvido rápido. Vocês podem ajudar?",
};

const questions = {
  time: choice("Qual time deve atender a `mensagem`?", {
    cobrancas: "Cobranças, fatura, contestação de lançamento ou estorno.",
    emissao: "Emissão do cartão, entrega, segunda via ou status de envio.",
    acesso: "Login, senha ou dados cadastrais no app.",
    funcionamento: "Problemas no funcionamento do cartão, como chip, aproximação (NFC) ou cartão virtual.",
  }),
  frustracao: score("Quão frustrado está o cliente na `mensagem`?", [
    "Não está frustrado. Só está pedindo ajuda.",
    "Está desapontado ou incomodado, mas ainda educado.",
    "Está com forte irritação, fazendo reclamações ou ameaças.",
  ]),
  eUrgente: noul("A `mensagem` diz que o problema precisa ser resolvido rapidamente?"),
  temDefeito: noul("A `mensagem` descreve um cartão com defeito?"),
  jaTentouResolver: noul("O cliente já tentou resolver o problema por conta própria?"),
  querEstorno: noul("A `mensagem` pede um estorno?"),
  foiCobradoErrado: noul("Se a `mensagem` for sobre uma cobrança, o cliente diz que foi cobrado incorretamente?"),
};

const startedAt = performance.now();
let tokensDeEntrada = 0;

for (const [nome, pergunta] of Object.entries(questions)) {
  const { usage } = await client.systemOne({ state, questions: { [nome]: pergunta } });
  tokensDeEntrada += usage.input_tokens;
}

const elapsedMs = performance.now() - startedAt;

console.log("Requisições:", Object.keys(questions).length);
console.log(`Tempo: ${elapsedMs.toFixed(0)} ms`);
console.log("Tokens de entrada:", tokensDeEntrada);

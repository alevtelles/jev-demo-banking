import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  cliente: { nome: "Marina", cartao: "Aurora Black" },
  emissao: { produto: "Cartão de crédito Aurora Black", emitido: "3 semanas atrás" },
  mensagem:
    "Oi, meu cartão Aurora parou de ser lido na maquininha. A luz do chip nem acende, e já testei em duas maquininhas diferentes. " +
    "Uso ele todos os dias para o trabalho, então eu realmente gostaria que isso fosse resolvido rápido. Vocês podem ajudar?",
};

const startedAt = performance.now();

const { answers, usage } = await client.systemOne({
  state,
  questions: {
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
  },
});

const elapsedMs = performance.now() - startedAt;

console.log("Requisições: 1");
console.log(`Tempo: ${elapsedMs.toFixed(0)} ms`);
console.log("Tokens de entrada:", usage.input_tokens);
console.log("time:", answers.time.choice);

if (answers.time.choice === "cobrancas") {
  console.log("foiCobradoErrado:", answers.foiCobradoErrado.noul.toFixed(2));
} else {
  console.log("Não é sobre uma cobrança, então foiCobradoErrado é ignorado.");
}

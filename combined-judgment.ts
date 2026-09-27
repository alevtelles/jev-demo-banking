import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

if (!process.env.TYPESAFE_API_KEY) {
  console.error("Adicione sua chave de API da TypeSafe ao .env antes de rodar este exemplo.");
  process.exit(1);
}

const client = new TypeSafeClient();

const state = {
  mensagem: "Já entrei em contato três vezes e continuo esperando uma resposta sobre o meu cartão.",
};

const startedAt = performance.now();
const response = await client.systemOne({
  state,
  questions: {
    estaFrustrado: noul("A `mensagem` expressa frustração?"),
    tipoDeSolicitacao: choice("Qual é o principal pedido em `mensagem`?", {
      atualizacao: "Pede uma atualização ou andamento de uma solicitação já aberta.",
      estorno: "Pede a devolução de um valor cobrado.",
      segundaVia: "Pede a emissão de uma segunda via do cartão.",
      outro: "O pedido principal não se encaixa nas outras opções.",
    }),
    nivelDeFrustracao: score("Quanta frustração `mensagem` expressa?", [
      "Faz um pedido sem expressar frustração.",
      "Expressa insatisfação sem grande irritação.",
      "Expressa forte irritação.",
    ]),
  },
});
const elapsedMs = performance.now() - startedAt;

console.dir(response, { depth: null });
console.log(`Tempo: ${elapsedMs.toFixed(0)} ms`);

const reviewThreshold = 0.8; // Limiar ilustrativo para este exemplo.
if (response.answers.estaFrustrado.noul >= reviewThreshold) {
  console.log("Marcar esta mensagem para revisão humana.");
} else {
  console.log("Manter esta mensagem na fila normal de atendimento.");
}

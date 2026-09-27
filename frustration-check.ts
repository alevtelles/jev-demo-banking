import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

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
  },
});
const elapsedMs = performance.now() - startedAt;

console.dir(response, { depth: null });
console.log(`Tempo: ${elapsedMs.toFixed(0)} ms`);

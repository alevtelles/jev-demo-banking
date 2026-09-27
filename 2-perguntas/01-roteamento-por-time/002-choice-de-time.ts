import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  mensagem:
    "Oi, estou tentando baixar a fatura do meu cartão Aurora para uma prestação de contas, mas não consigo entrar no app. " +
    "Fica dizendo que minha senha está errada, e o e-mail de redefinição nunca chega. Preciso da fatura até sexta.",
};

const { answers } = await client.systemOne({
  state,
  questions: {
    time: choice("Qual time deve atender a `mensagem`?", {
      cobrancas: "Cobranças, fatura, contestação de lançamento ou estorno.",
      emissao: "Emissão do cartão, entrega, segunda via ou status de envio.",
      acesso: "Login, senha ou dados cadastrais no app.",
      funcionamento: "Problemas no funcionamento do cartão, como chip, aproximação (NFC) ou cartão virtual.",
    }),
  },
});

console.log("Enviar para:", answers.time.choice);
console.log("probabilidades:", answers.time.probabilities);

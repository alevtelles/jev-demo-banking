import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  mensagem: "Oi! Vocês têm uma agência em Amsterdã onde eu possa retirar meu cartão Aurora pessoalmente?",
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
console.log("confiança:", answers.time.confidence.toFixed(2));

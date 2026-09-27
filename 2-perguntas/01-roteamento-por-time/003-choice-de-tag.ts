import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  mensagem:
    "Pedi a segunda via do meu cartão adicional no dia 10 e o rastreio não atualiza há cinco dias. " +
    "Também queria confirmar se vocês me cobraram só uma vez a taxa de emissão. No meu extrato aparecem dois lançamentos pendentes.",
};

const { answers } = await client.systemOne({
  state,
  questions: {
    tag: choice("Qual time deve atender a `mensagem`?", {
      cobrancas: "Cobranças, fatura, contestação de lançamento ou estorno.",
      emissao: "Emissão do cartão, entrega, segunda via ou status de envio.",
      acesso: "Login, senha ou dados cadastrais no app.",
      funcionamento: "Problemas no funcionamento do cartão, como chip, aproximação (NFC) ou cartão virtual.",
    }),
  },
});

console.log("Tags:", [answers.tag.choice]);
console.log("probabilidades:", answers.tag.probabilities);

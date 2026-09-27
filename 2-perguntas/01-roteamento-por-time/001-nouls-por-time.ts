import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  mensagem:
    "Oi, estou tentando baixar a fatura do meu cartão Aurora para uma prestação de contas, mas não consigo entrar no app. " +
    "Fica dizendo que minha senha está errada, e o e-mail de redefinição nunca chega. Preciso da fatura até sexta.",
};

const { answers } = await client.systemOne({
  state,
  questions: {
    cobrancas: noul("A `mensagem` é sobre cobranças, fatura, contestação de lançamento ou estorno?"),
    emissao: noul("A `mensagem` é sobre emissão do cartão, entrega, segunda via ou status de envio?"),
    acesso: noul("A `mensagem` é sobre login, senha ou dados cadastrais no app?"),
    funcionamento: noul("A `mensagem` é sobre um problema no funcionamento do cartão, como chip, aproximação (NFC) ou cartão virtual?"),
  },
});

for (const [time, resposta] of Object.entries(answers)) {
  console.log(`${time}:`, resposta.noul.toFixed(2));
}

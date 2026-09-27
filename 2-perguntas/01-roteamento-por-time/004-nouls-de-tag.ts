import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  mensagem:
    "Pedi a segunda via do meu cartão adicional no dia 10 e o rastreio não atualiza há cinco dias. " +
    "Também queria confirmar se vocês me cobraram só uma vez a taxa de emissão. No meu extrato aparecem dois lançamentos pendentes.",
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

const tags = Object.entries(answers)
  .filter(([, resposta]) => resposta.noul >= 0.5)
  .map(([tag]) => tag);

for (const [tag, resposta] of Object.entries(answers)) {
  console.log(`${tag}:`, resposta.noul.toFixed(2));
}
console.log("Tags:", tags);

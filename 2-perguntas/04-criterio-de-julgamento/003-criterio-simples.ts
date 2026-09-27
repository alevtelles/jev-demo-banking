import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "Pedi a segunda via do meu cartão adicional há duas semanas. Já chegou? E quando vejo o estorno da taxa duplicada?",
  "Minha solicitação de segunda via foi entregue no seu centro de distribuição. Cadê meu estorno?",
];

for (const mensagem of mensagens) {
  const { answers } = await client.systemOne({
    state: { mensagem },
    questions: {
      time: choice("Qual time deve atender a `mensagem`?", {
        cobrancas: "Cobranças, fatura, contestação de lançamento ou estorno.",
        emissao: "Emissão do cartão, entrega, segunda via ou status de envio.",
        acesso: "Login, senha ou dados cadastrais no app.",
        funcionamento: "Problemas no funcionamento do cartão, como chip, aproximação (NFC) ou cartão virtual.",
      }),
    },
  });

  console.log(mensagem);
  console.log(`  ${answers.time.choice}, confiança ${answers.time.confidence.toFixed(2)}`);
}

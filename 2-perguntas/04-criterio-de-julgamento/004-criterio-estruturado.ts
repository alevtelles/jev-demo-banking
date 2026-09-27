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
        cobrancas: {
          covers: "Cobranças, fatura, contestação de lançamento ou estorno",
          not_for: "Enviar um cartão de volta ou solicitar uma segunda via",
          examples: ["Fui cobrado duas vezes", "Quando meu estorno chega?"],
        },
        emissao: {
          covers: "Emissão do cartão, entrega, segunda via ou status de envio",
          not_for: "O status de um estorno ou de uma cobrança",
          examples: ["Cadê meu cartão?", "Como peço uma segunda via?"],
        },
        acesso: {
          covers: "Login, senha ou dados cadastrais no app",
          not_for: "Cobranças ou entregas",
          examples: ["Não consigo entrar no app", "Quero mudar meu e-mail"],
        },
        funcionamento: {
          covers: "Problemas no funcionamento do cartão, como chip, aproximação (NFC) ou cartão virtual",
          not_for: "Entregas ou estornos",
          examples: ["Meu cartão não é lido", "A aproximação não funciona"],
        },
      }),
    },
  });

  console.log(mensagem);
  console.log(`  ${answers.time.choice}, confiança ${answers.time.confidence.toFixed(2)}`);
}

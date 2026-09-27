import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "Minha solicitação de segunda via foi entregue no centro de distribuição de vocês. Cadê meu estorno?",
  "Tem algo errado com meu cartão e minha conta no app. Alguém pode ajudar?",
  "Pedi a segunda via do cartão adicional há duas semanas. Já chegou? E quando vejo o estorno da taxa duplicada?",
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

  const { choice: time, confidence } = answers.time;

  // Limiares de exemplo. Escolha os seus testando suas próprias mensagens.
  let acao: string;
  if (confidence >= 0.9) {
    acao = `Enviar para ${time}`;
  } else if (confidence >= 0.6) {
    acao = `Perguntar ao cliente para confirmar: isso é sobre ${time}?`;
  } else {
    acao = "Enviar para uma pessoa triar";
  }

  console.log(mensagem);
  console.log(`  ${time}, confiança ${confidence.toFixed(2)} -> ${acao}`);
}

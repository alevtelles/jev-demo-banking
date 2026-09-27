import { score, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "Que ótimo, o segundo cartão também deu defeito. Adorei.",
  "Ah que maravilha, mais uma semana sem conseguir usar o cartão. Muito obrigada.",
  "Se isso acontecer de novo, eu cancelo tudo com vocês.",
];

for (const mensagem of mensagens) {
  const { answers } = await client.systemOne({
    state: { mensagem },
    questions: {
      frustracao: score("Quão frustrado está o cliente na `mensagem`?", [
        {
          summary: "Não está frustrado",
          signals: ["Só está pedindo ajuda", "Tom neutro ou amigável"],
        },
        {
          summary: "Está desapontado ou incomodado, mas ainda educado",
          signals: ["Menciona um problema repetido", "Sarcasmo ou desânimo, sem ameaças"],
        },
        {
          summary: "Está irritado",
          signals: ["Reclamações sobre o banco", "Ameaças de cancelar, deixar uma avaliação ou contestar uma cobrança"],
        },
      ]),
    },
  });

  const { score: nivel, confidence } = answers.frustracao;
  console.log(nivel.toFixed(2), `(confiança ${confidence.toFixed(2)})`, "", mensagem);
}

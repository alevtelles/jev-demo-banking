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
        "Não está frustrado. Só está pedindo ajuda.",
        "Está desapontado ou incomodado, mas ainda educado.",
        "Está com forte irritação, fazendo reclamações ou ameaças.",
      ]),
    },
  });

  const { score: nivel, confidence } = answers.frustracao;
  console.log(nivel.toFixed(2), `(confiança ${confidence.toFixed(2)})`, "", mensagem);
}

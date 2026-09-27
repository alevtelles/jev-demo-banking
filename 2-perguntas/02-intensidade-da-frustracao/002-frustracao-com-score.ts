import { score, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "Oi, meu cartão Aurora parou de ser lido na maquininha. A luz do chip nem acende. Vocês podem ajudar?",
  "Tentei o reset que vocês sugeriram e ainda não funciona. Esse já é o segundo cartão com defeito esse ano, o que é bem decepcionante.",
  "Isso é um absurdo. Terceira vez que escrevo sobre isso e ninguém resolveu. Se eu não tiver retorno hoje, vou cancelar meu cartão Black e deixar uma avaliação.",
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
  console.log(nivel.toFixed(2), `(confiança ${confidence.toFixed(2)})`, "", mensagem.slice(0, 60) + "...");
}

import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "O cartão chegou com o chip trincado. Quero meu dinheiro de volta.",
  "O chip está um pouco arranhado. Podem estornar parte da anuidade e eu fico com o cartão?",
  "Esse cartão não é bem pra mim. Posso trocar por crédito na fatura?",
  "Não tenho certeza se esse cartão é pra mim. Posso cancelar e mandar de volta?",
];

for (const mensagem of mensagens) {
  const { answers } = await client.systemOne({
    state: { mensagem },
    questions: {
      querEstorno: noul("O cliente na `mensagem` quer um estorno?"),
    },
  });

  console.log(answers.querEstorno.noul.toFixed(2), "", mensagem);
}

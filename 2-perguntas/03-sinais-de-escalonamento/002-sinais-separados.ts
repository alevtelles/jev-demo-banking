import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "Oi, meu cartão Aurora parou de ser lido na maquininha. Vocês podem ajudar?",
  "Essa é a terceira vez que entro em contato sobre o mesmo problema. Quero falar com um supervisor.",
  "Já contestei essa cobrança e registrei uma reclamação no Banco Central. Se não for resolvido até segunda, vou falar com um advogado.",
  "Sincera, estou bem decepcionada. Adoro os benefícios do cartão, mas esse já é o segundo que apresenta defeito.",
  "Cancelem meu cartão Black. Não quero mais.",
];

for (const mensagem of mensagens) {
  const { answers } = await client.systemOne({
    state: { mensagem },
    questions: {
      pedeSupervisor: noul("A `mensagem` pede para falar com um supervisor ou alguém mais sênior?"),
      ameacaCancelar: noul("A `mensagem` ameaça cancelar o cartão ou deixar de ser cliente?"),
      mencionaProconOuJudicial: noul("A `mensagem` menciona ação judicial, Procon ou reclamação no Banco Central (BACEN)?"),
      contatoRepetido: noul("A `mensagem` diz que o cliente já entrou em contato sobre isso antes?"),
    },
  });

  // Nossa política de escalonamento: qualquer um destes sinais já é suficiente.
  const deveEscalar = Object.values(answers).some(
    (resposta) => resposta.noul >= 0.8,
  );

  console.log(mensagem);
  for (const [sinal, resposta] of Object.entries(answers)) {
    console.log(`  ${sinal}:`, resposta.noul.toFixed(2));
  }
  console.log("  Escalar:", deveEscalar ? "sim" : "não");
}

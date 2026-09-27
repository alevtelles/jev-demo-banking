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
      deveEscalar: noul("Esse chamado deve ser escalado?"),
    },
  });

  console.log(answers.deveEscalar.noul.toFixed(2), "", mensagem);
}

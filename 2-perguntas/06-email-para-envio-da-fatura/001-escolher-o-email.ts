import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "Oi, podem enviar a fatura do meu cartão Aurora para o meu e-mail de trabalho, marina@aurorabank.example.br? " +
    "Por favor não usem meu e-mail pessoal (marina.alves@mail.example.br). " +
    "Minha gerente, priscila@aurorabank.example.br, vai aprovar o reembolso.",
  "Por favor enviem a fatura para o meu e-mail de trabalho: marina arroba aurorabank ponto example ponto com ponto br. Obrigada!",
];

for (const mensagem of mensagens) {
  const candidatos = mensagem.match(/[\w.+-]+@[\w-]+\.[\w.-]+\w/g) ?? [];

  const { answers } = await client.systemOne({
    state: { mensagem },
    questions: {
      emailDaFatura: choice("Para qual endereço de e-mail o cliente na `mensagem` quer que a fatura seja enviada?", {
        ...Object.fromEntries(candidatos.map((endereco) => [endereco, null])),
        nenhum: "Nenhum destes é o endereço que o cliente quer.",
      }),
    },
  });

  console.log("Candidatos:", candidatos);
  console.log("Enviar fatura para:", answers.emailDaFatura.choice);
  console.log();
}

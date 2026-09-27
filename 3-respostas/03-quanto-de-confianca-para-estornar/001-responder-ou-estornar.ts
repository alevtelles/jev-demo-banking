import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "O cartão Aurora parou de funcionar depois de uma semana de uso. Quero o estorno da anuidade, por favor.",
  "O cartão Aurora parou de funcionar depois de uma semana de uso. Quero o estorno da anuidade, a menos que consigam me enviar uma segunda via rapidamente.",
];

for (const mensagem of mensagens) {
  const { answers } = await client.systemOne({
    state: { mensagem },
    questions: {
      quer: choice("O que o cliente na `mensagem` quer?", {
        estorno: "O valor de volta.",
        segunda_via: "Uma nova via do cartão para substituir esse.",
        informacao: "Informações sobre as opções.",
      }),
    },
  });

  const { choice: intencao, confidence } = answers.quer;

  // Limiares de exemplo. Quanto mais arriscada a ação, mais alta a barra.
  const acoes = [
    { acao: `Sugerir uma resposta sobre o(a) ${intencao}`, confiancaMinima: 0.5 },
    { acao: `Realizar o(a) ${intencao} automaticamente`, confiancaMinima: 0.95 },
  ];

  console.log(mensagem);
  console.log(`  ${intencao}, confiança ${confidence.toFixed(2)}`);
  for (const { acao, confiancaMinima } of acoes) {
    const permitido = confidence >= confiancaMinima;
    console.log(`  ${permitido ? "sim" : "não"}  ${acao} (precisa de ${confiancaMinima})`);
  }
}

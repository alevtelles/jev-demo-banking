import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state =
  "Chamado: cartão não é lido na maquininha. Status: aberto. Canal: app. " +
  "Cliente: Marina. Cartão: Aurora Black. " +
  "Benefício do cartão: segunda via gratuita por defeito, dentro de 12 meses da emissão. " +
  "Cartão emitido há 3 semanas. " +
  'Mensagem do cliente: "Oi, peguei meu cartão Aurora Black há cerca de três semanas ' +
  "e ele parou de ser lido na maquininha. A luz do chip nem acende, " +
  "e já testei em duas maquininhas diferentes. Vocês conseguem me ajudar?\"";

const { answers } = await client.systemOne({
  state,
  questions: {
    cartaoComDefeito: noul("A mensagem do cliente descreve um cartão com defeito?"),
    cobertoPeloBeneficio: noul("O cartão está coberto para uma segunda via gratuita pelo benefício descrito?"),
  },
});

console.log("cartaoComDefeito:", answers.cartaoComDefeito.noul.toFixed(2));
console.log("cobertoPeloBeneficio:", answers.cobertoPeloBeneficio.noul.toFixed(2));

import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  chamado: {
    assunto: "Cartão não é lido na maquininha",
    status: "aberto",
    canal: "app",
  },
  cliente: {
    nome: "Marina",
    cartao: "Aurora Black",
    beneficio_cartao:
      "Segunda via gratuita por defeito, dentro de 12 meses da emissão.",
  },
  emissao: {
    produto: "Cartão de crédito Aurora Black",
    anuidade_reais: 490,
    emitido: "3 semanas atrás",
  },
  mensagem:
    "Oi, peguei meu cartão Aurora Black há cerca de três semanas e ele parou de ser lido na maquininha. " +
    "A luz do chip nem acende, e já testei em duas maquininhas diferentes. Vocês conseguem me ajudar?",
};

const { answers } = await client.systemOne({
  state,
  questions: {
    cartaoComDefeito: noul("A `mensagem` descreve um cartão com defeito?"),
    cobertoPeloBeneficio: noul("A `emissao.produto` está coberta para uma segunda via gratuita pelo `cliente.beneficio_cartao`?"),
  },
});

console.log("cartaoComDefeito:", answers.cartaoComDefeito.noul.toFixed(2));
console.log("cobertoPeloBeneficio:", answers.cobertoPeloBeneficio.noul.toFixed(2));

import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const historicoAtendimentos = [
  {
    assunto: "Cartão chegou com defeito",
    aberto_em: "2026-03-04",
    mensagens: [
      { de: "cliente", texto: "Meu cartão Aurora novo chegou e o chip não funciona. Decepcionante pra um cartão Black." },
      { de: "atendente", texto: "Sinto muito por isso! Uma segunda via já está a caminho." },
      { de: "cliente", texto: "Já faz dez dias e nada chegou. Isso é bem frustrante." },
      { de: "atendente", texto: "Desculpe, ficou retido no centro de distribuição. Vai ser enviado hoje." },
      { de: "cliente", texto: "Tudo bem. Finalmente." },
    ],
  },
  {
    assunto: "Cobrado duas vezes",
    aberto_em: "2026-06-12",
    mensagens: [
      { de: "cliente", texto: "Fui cobrado duas vezes pela anuidade do cartão adicional. Já estou cansada desses problemas." },
      { de: "atendente", texto: "Você tem razão, cobramos duas vezes. A cobrança duplicada já foi estornada." },
      { de: "cliente", texto: "O estorno ainda não caiu no meu cartão depois de uma semana. Por que tudo demora tanto?" },
      { de: "atendente", texto: "Foi enviado no dia 13 de junho. Pode levar até 10 dias para aparecer." },
    ],
  },
  {
    assunto: "Cartão parou de ser lido",
    aberto_em: "2026-09-22",
    mensagens: [
      { de: "cliente", texto: "Meu cartão parou de ser lido na maquininha. Esse já é o segundo cartão com problema." },
      { de: "atendente", texto: "Sinto muito, Marina. Já enviei uma segunda via, deve chegar até sexta." },
      { de: "cliente", texto: "A segunda via chegou hoje e está funcionando perfeitamente. Obrigada por resolver tão rápido!" },
    ],
  },
];

const { answers, usage } = await client.systemOne({
  state: {
    cliente: { nome: "Marina Alves", cartao: "Aurora Black" },
    chamado_atual: historicoAtendimentos[historicoAtendimentos.length - 1],
  },
  questions: {
    estaFrustrado: noul("O cliente está frustrado?"),
  },
});

console.log("estaFrustrado:", answers.estaFrustrado.noul.toFixed(2));
console.log("Tokens de entrada:", usage.input_tokens);

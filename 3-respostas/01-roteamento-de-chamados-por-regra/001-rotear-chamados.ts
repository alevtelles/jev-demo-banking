import { choice, noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const hoje = new Date("2026-09-26");

function dentroDeUmAno(emitidoEm: string) {
  const cobertoAte = new Date(emitidoEm);
  cobertoAte.setFullYear(cobertoAte.getFullYear() + 1);
  return hoje <= cobertoAte;
}

const chamados = [
  {
    cliente: "Marina",
    cartao: "Aurora Black",
    emitidoEm: "2026-09-05",
    mensagem: "Meu cartão Aurora parou de ser lido na maquininha. Já tentei duas maquininhas diferentes e o botão de reset, e nada funciona.",
  },
  {
    cliente: "Rafael",
    cartao: "Aurora Black",
    emitidoEm: "2025-08-14",
    mensagem: "A aproximação (NFC) do meu cartão Aurora parou de funcionar. O chip funciona normalmente. Já resetei duas vezes no app.",
  },
  {
    cliente: "Priscila",
    cartao: "Aurora Classic",
    emitidoEm: "2026-09-18",
    mensagem: "Cadê a segunda via do meu cartão? O rastreio não atualiza há cinco dias.",
  },
  {
    cliente: "Leandro",
    cartao: "Aurora Classic",
    emitidoEm: "2026-09-02",
    mensagem: "Quero cancelar o cartão Aurora. É bonito, mas os benefícios não são o que eu esperava.",
  },
  {
    cliente: "Nina",
    cartao: "Aurora Black",
    emitidoEm: "2026-08-28",
    mensagem:
      "Vocês enviaram o cartão com o nome errado gravado, fui cobrada duas vezes pela anuidade, e agora a segunda via que enviaram " +
      "também não liga o chip. Já estou esperando duas semanas pra resolver isso.",
  },
];

for (const chamado of chamados) {
  const { answers } = await client.systemOne({
    state: { mensagem: chamado.mensagem },
    questions: {
      intencao: choice("O que o cliente na `mensagem` precisa?", {
        cartao_com_defeito: "Um cartão que o cliente possui não está funcionando corretamente.",
        status_da_emissao: "Uma atualização sobre onde está uma emissão ou segunda via.",
        cancelamento: "Cancelar um cartão que funciona, mas o cliente não quer mais.",
        outro: "Qualquer outra coisa.",
      }),
      variosProblemas: noul("A `mensagem` descreve vários problemas separados?"),
    },
  });

  let rota = "Enviar para a fila geral";

  if (answers.variosProblemas.noul >= 0.8) {
    rota = "Enviar para um atendente";
  } else if (answers.intencao.choice === "cartao_com_defeito") {
    rota =
      chamado.cartao === "Aurora Black" && dentroDeUmAno(chamado.emitidoEm)
        ? "Enviar segunda via gratuita"
        : "Enviar para um atendente";
  } else if (answers.intencao.choice === "status_da_emissao") {
    rota = "Responder com o link de rastreio";
  } else if (answers.intencao.choice === "cancelamento") {
    rota = "Enviar instruções de cancelamento por e-mail";
  }

  console.log(`${chamado.cliente}: ${answers.intencao.choice}, variosProblemas ${answers.variosProblemas.noul.toFixed(2)}`);
  console.log(`  -> ${rota}`);
}

import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

type ClienteJev = { systemOne: TypeSafeClient["systemOne"] };

interface Transacao {
  status: "pending" | "posted" | "reversed";
  valor: number;
}

interface PoliticaDeEstorno {
  permiteEstornoAutomatico: boolean;
  limiteAutomatico: number;
}

async function decidirAcaoEstornoComFallback(
  client: ClienteJev,
  chamado: { mensagem: string },
  transacao: Transacao,
  politica: PoliticaDeEstorno,
) {
  try {
    const { answers } = await client.systemOne({
      state: { mensagem: chamado.mensagem },
      questions: {
        querEstorno: noul("A `mensagem` pede um estorno?"),
        foiCobradoErrado: noul("O cliente diz que foi cobrado incorretamente?"),
      },
    });

    // Elegibilidade = julgamento do Jev (o que o cliente alega) E fatos do
    // sistema (o que a transação e a política permitem). Nenhum dos dois
    // decide por si só. Ver a seção "Policy Engine" no artigo.
    const elegivel =
      answers.querEstorno.noul >= 0.95 &&
      answers.foiCobradoErrado.noul >= 0.95 &&
      transacao.status === "posted" &&
      politica.permiteEstornoAutomatico &&
      transacao.valor <= politica.limiteAutomatico;

    if (elegivel) {
      return {
        acao: "estornar_automaticamente",
        automatica: true,
        motivoAuditoria:
          `Julgamento: querEstorno ${answers.querEstorno.noul.toFixed(2)}, ` +
          `foiCobradoErrado ${answers.foiCobradoErrado.noul.toFixed(2)}. ` +
          `Transação ${transacao.status}, valor dentro do limite automático de ${politica.limiteAutomatico}.`,
      };
    }
    if (answers.querEstorno.noul >= 0.6 || answers.foiCobradoErrado.noul >= 0.6) {
      return { acao: "confirmar_com_cliente", automatica: false };
    }
    return {
      acao: "escalar_para_analista",
      automatica: false,
      motivoAuditoria: "Confiança insuficiente ou transação fora dos critérios de elegibilidade automática.",
    };
  } catch (erro) {
    // Fail closed: indisponibilidade do Jev nunca vira decisão automática.
    return {
      acao: "escalar_para_analista",
      automatica: false,
      motivoAuditoria: `Jev indisponível (${(erro as Error).message}). Nenhuma decisão financeira automática foi tomada.`,
    };
  }
}

const chamado = {
  mensagem: "Fui cobrado duas vezes pela anuidade do meu cartão Aurora. Quero o estorno da cobrança duplicada.",
};
const transacao: Transacao = { status: "posted", valor: 490 };
const politica: PoliticaDeEstorno = { permiteEstornoAutomatico: true, limiteAutomatico: 1000 };

console.log("Cenário normal (Jev responde):");
try {
  console.log(await decidirAcaoEstornoComFallback(new TypeSafeClient(), chamado, transacao, politica));
} catch (erro) {
  console.log("(Requer TYPESAFE_API_KEY no .env para este cenário, pulando. Erro:", (erro as Error).message, ")");
}

const clienteIndisponivel: ClienteJev = {
  systemOne: (async () => {
    throw new Error("ETIMEDOUT: tempo de resposta do Jev excedido");
  }) as unknown as TypeSafeClient["systemOne"],
};

console.log("\nCenário de falha (Jev indisponível):");
console.log(await decidirAcaoEstornoComFallback(clienteIndisponivel, chamado, transacao, politica));

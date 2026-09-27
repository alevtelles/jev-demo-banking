import { score, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const chamadosAbertos = [
  {
    id: "T-101",
    cartao: "Aurora Classic",
    horasEsperando: 30,
    mensagem: "O chip do meu cartão Aurora às vezes falha na maquininha, mas ainda funciona. Só queria avisar.",
  },
  {
    id: "T-102",
    cartao: "Aurora Black",
    horasEsperando: 2,
    mensagem: "Meu cartão não é lido em lugar nenhum desde hoje de manhã. Uso ele todos os dias para o trabalho, então realmente preciso resolver isso.",
  },
  {
    id: "T-103",
    cartao: "Aurora Classic",
    horasEsperando: 26,
    mensagem: "Terceira vez que peço. Minha segunda via ainda não chegou e ninguém responde. Isso é completamente inaceitável.",
  },
  {
    id: "T-104",
    cartao: "Aurora Black",
    horasEsperando: 5,
    mensagem: "A função de aproximação (NFC) do meu cartão falha de vez em quando, mas volta a funcionar depois de um tempo.",
  },
];

type ChamadoJulgado = (typeof chamadosAbertos)[number] & { impacto: number; frustracao: number };

const chamados: ChamadoJulgado[] = [];

for (const chamado of chamadosAbertos) {
  const { answers } = await client.systemOne({
    state: { mensagem: chamado.mensagem },
    questions: {
      impacto: score("O quanto o problema na `mensagem` impede o cliente de usar o cartão?", [
        "Não impede nada. Tudo continua funcionando.",
        "Impede parcialmente. Funciona, mas algo está quebrado ou instável.",
        "Impede completamente. O cliente não consegue usar.",
      ]),
      frustracao: score("Quão frustrado está o cliente na `mensagem`?", [
        "Não está frustrado. Só está pedindo ajuda.",
        "Está desapontado ou incomodado, mas ainda educado.",
        "Está com forte irritação, fazendo reclamações ou ameaças.",
      ]),
    },
  });

  // Cada Score tem 3 níveis (0 a 2), então dividimos por 2 para obter um valor de 0 a 1.
  chamados.push({
    ...chamado,
    impacto: answers.impacto.score / 2,
    frustracao: answers.frustracao.score / 2,
  });
}

type Pesos = { impacto: number; frustracao: number; cartao: number; espera: number };

function ordenar(pesos: Pesos) {
  return chamados
    .map((chamado) => {
      const prioridade =
        chamado.impacto * pesos.impacto +
        chamado.frustracao * pesos.frustracao +
        (chamado.cartao === "Aurora Black" ? 1 : 0) * pesos.cartao +
        Math.min(chamado.horasEsperando / 24, 1) * pesos.espera;
      return { id: chamado.id, mensagem: chamado.mensagem, prioridade };
    })
    .sort((a, b) => b.prioridade - a.prioridade);
}

console.log("Pesos focados no produto:");
for (const { id, prioridade, mensagem } of ordenar({ impacto: 0.5, frustracao: 0.1, cartao: 0.2, espera: 0.2 })) {
  console.log(`  ${prioridade.toFixed(2)} ${id} ${mensagem.slice(0, 50)}...`);
}

// Novas prioridades, mesmas respostas. Nenhuma nova chamada ao Jev.
console.log("Pesos focados no relacionamento com o cliente:");
for (const { id, prioridade, mensagem } of ordenar({ impacto: 0.2, frustracao: 0.4, cartao: 0.1, espera: 0.3 })) {
  console.log(`  ${prioridade.toFixed(2)} ${id} ${mensagem.slice(0, 50)}...`);
}

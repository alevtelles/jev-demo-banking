import { randomUUID } from "node:crypto";

interface EventoDecisao {
  decision_id: string;
  ticket_id: string;
  idempotency_key: string;
  judgment: { intent: string; confidence: number };
  policy_version: string;
  judgment_version: string;
  decision: string;
  automatica: boolean;
}

// O Map em memória é só para este exemplo rodar isolado com `npm run scenario`.
// Em produção, a chave de idempotência vive num armazenamento durável
// (banco relacional, Redis com TTL) compartilhado entre instâncias do orchestrator.
const decisoesProcessadas = new Map<string, EventoDecisao>();

function registrarDecisao(
  ticketId: string,
  intencao: string,
  confianca: number,
  decisao: string,
  automatica: boolean,
): EventoDecisao {
  const idempotencyKey = `refund:${ticketId}`;

  const existente = decisoesProcessadas.get(idempotencyKey);
  if (existente) {
    // Retry do orchestrator: devolve o mesmo evento, não executa a ação de novo.
    return existente;
  }

  const evento: EventoDecisao = {
    decision_id: randomUUID(),
    ticket_id: ticketId,
    idempotency_key: idempotencyKey,
    judgment: { intent: intencao, confidence: confianca },
    policy_version: "refund-policy-v1",
    judgment_version: "jev-1.13.0",
    decision: decisao,
    automatica,
  };

  decisoesProcessadas.set(idempotencyKey, evento);
  return evento;
}

const primeiraTentativa = registrarDecisao("T-501", "cartao_com_defeito", 0.97, "estornar_automaticamente", true);
console.log("Primeira tentativa:", primeiraTentativa);

// Simula um retry do orchestrator para o mesmo chamado (ex.: timeout na confirmação de rede).
const retry = registrarDecisao("T-501", "cartao_com_defeito", 0.97, "estornar_automaticamente", true);
console.log("\nRetry (mesmo ticket):", retry);

console.log("\nMesmo decision_id nas duas chamadas?", primeiraTentativa.decision_id === retry.decision_id);

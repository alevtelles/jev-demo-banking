import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const datasDeEmissao = ["2026-07-10", "2025-11-02", "2025-08-14"];

for (const emitidoEm of datasDeEmissao) {
  const { answers } = await client.systemOne({
    state: {
      cliente: {
        nome: "Marina Alves",
        cartao: "Aurora Black",
        beneficio_cartao: "Segunda via gratuita por defeito, dentro de 12 meses da emissão.",
      },
      emissao: { produto: "Cartão de crédito Aurora Black", emitido_em: emitidoEm },
      hoje: "2026-09-26",
      mensagem: "Meu cartão parou de ser lido na maquininha. Vocês podem emitir uma segunda via?",
    },
    questions: {
      cobertoPeloBeneficio: noul("A `emissao.produto` ainda está coberta pelo `cliente.beneficio_cartao`?"),
    },
  });

  console.log(`Emitido em ${emitidoEm}:`, answers.cobertoPeloBeneficio.noul.toFixed(2));
}

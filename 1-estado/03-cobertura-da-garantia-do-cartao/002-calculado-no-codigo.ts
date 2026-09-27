import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

function mesesEntre(de: string, ate: string) {
  const inicio = new Date(de);
  const fim = new Date(ate);
  return (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
}

const datasDeEmissao = ["2026-07-10", "2025-11-02", "2025-08-14"];

for (const emitidoEm of datasDeEmissao) {
  const meses = mesesEntre(emitidoEm, "2026-09-26");

  const { answers } = await client.systemOne({
    state: {
      cliente: {
        nome: "Marina Alves",
        cartao: "Aurora Black",
        beneficio_cartao: "Segunda via gratuita por defeito, dentro de 12 meses da emissão.",
      },
      emissao: { produto: "Cartão de crédito Aurora Black", emitido: `${meses} meses atrás` },
      mensagem: "Meu cartão parou de ser lido na maquininha. Vocês podem emitir uma segunda via?",
    },
    questions: {
      cobertoPeloBeneficio: noul("A `emissao.produto` ainda está coberta pelo `cliente.beneficio_cartao`?"),
    },
  });

  console.log(`Emitido há ${meses} meses:`, answers.cobertoPeloBeneficio.noul.toFixed(2));
}

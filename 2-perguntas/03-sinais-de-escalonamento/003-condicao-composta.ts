import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  mensagem: "O cartão chegou com o chip trincado. Posso pedir o estorno da anuidade, por favor?",
};

const { answers } = await client.systemOne({
  state,
  questions: {
    irritadoEQuerEstorno: noul("O cliente está irritado e pedindo um estorno?"),
    estaIrritado: noul("O cliente está irritado na `mensagem`?"),
    querEstorno: noul("A `mensagem` pede um estorno?"),
  },
});

console.log("Combinada:");
console.log("  irritadoEQuerEstorno:", answers.irritadoEQuerEstorno.noul.toFixed(2));
console.log("Separadas:");
console.log("  estaIrritado:", answers.estaIrritado.noul.toFixed(2));
console.log("  querEstorno:", answers.querEstorno.noul.toFixed(2));

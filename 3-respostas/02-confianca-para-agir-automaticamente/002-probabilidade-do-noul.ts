import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const mensagens = [
  "O cartão chegou com o chip trincado. Posso pedir um estorno, por favor?",
  "Obrigada, a segunda via chegou e está funcionando perfeitamente.",
  "Não tenho certeza se esse cartão é pra mim. Posso cancelar e mandar de volta?",
];

for (const mensagem of mensagens) {
  const { answers } = await client.systemOne({
    state: { mensagem },
    questions: {
      querEstorno: noul("O cliente na `mensagem` quer um estorno?"),
    },
  });

  const probabilidade = answers.querEstorno.noul;

  // Limiares de exemplo. Escolha os seus testando suas próprias mensagens.
  let acao: string;
  if (probabilidade >= 0.8) {
    acao = "Iniciar um estorno";
  } else if (probabilidade <= 0.2) {
    acao = "Estorno não é necessário";
  } else {
    acao = "Enviar para uma pessoa";
  }

  console.log(mensagem);
  console.log(`  ${probabilidade.toFixed(2)} -> ${acao}`);
}

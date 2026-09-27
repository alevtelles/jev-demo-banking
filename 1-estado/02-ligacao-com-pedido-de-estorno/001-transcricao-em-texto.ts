import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  transcricao_ligacao: [
    "Central Aurora, aqui é a Sofia. Como posso ajudar?",
    "Oi. Na verdade são duas coisas. Primeiro, eu me mudei no mês passado, preciso atualizar meu endereço.",
    "Claro, consigo fazer isso. Qual é o novo endereço?",
    "É Rua do Canal, 14, apartamento 3B.",
    "Entendi. E o CEP?",
    "01012-000.",
    "Perfeito, endereço atualizado. Qual era a outra coisa?",
    "Meu cartão Aurora parou de ser lido na maquininha. Peguei ele há algumas semanas.",
    "Sinto muito por isso. A luz do chip chega a acender?",
    "Não.",
    "Já tentou a função de aproximação, o NFC?",
    "Sim, também não funciona.",
    "Entendi. Pode tentar inserir o cartão em outra maquininha, se tiver à mão?",
    "Já tentei em duas diferentes. Nada.",
    "Certo, isso indica um defeito no chip.",
    "Ótimo. Esse já é o segundo cartão.",
    "Sinto muito mesmo. Deixa eu ver sua conta aqui. Vejo que o primeiro foi trocado em março.",
    "Uhum.",
    "Então eu tenho duas opções. Posso enviar uma segunda via para o seu novo endereço, ou estornar a anuidade integralmente.",
    "O que você faria?",
    "Sinceramente, se for o segundo caso, eu pediria o estorno. Também posso adicionar um cupom de 10% de desconto na próxima anuidade.",
    "Ok.",
    "E você gostaria que eu cancelasse o cartão adicional que você pediu também? Ele ainda não foi enviado.",
    "Sim, pode cancelar.",
    "Feito. Então fica assim: estorno integral da anuidade do cartão, o cartão adicional foi cancelado, e o cupom de desconto está no seu e-mail.",
    "Obrigada.",
    "Mais alguma coisa?",
    "Na verdade, posso deixar uma avaliação em algum lugar? Quero comentar como você foi prestativa.",
    "Que gentileza sua. Tem um link no e-mail. Tenha um ótimo dia.",
    "Você também. Tchau.",
  ].join("\n"),
};

const { answers } = await client.systemOne({
  state,
  questions: {
    pediuEstorno: noul("O cliente pediu um estorno?"),
    concordouComCancelarCartaoAdicional: noul("O cliente concordou em cancelar o cartão adicional?"),
  },
});

console.log("pediuEstorno:", answers.pediuEstorno.noul.toFixed(2));
console.log("concordouComCancelarCartaoAdicional:", answers.concordouComCancelarCartaoAdicional.noul.toFixed(2));

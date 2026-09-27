import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  transcricao_ligacao: {
    cliente: [
      "Oi. Na verdade são duas coisas. Primeiro, eu me mudei no mês passado, preciso atualizar meu endereço.",
      "É Rua do Canal, 14, apartamento 3B.",
      "01012-000.",
      "Meu cartão Aurora parou de ser lido na maquininha. Peguei ele há algumas semanas.",
      "Não.",
      "Sim, também não funciona.",
      "Já tentei em duas diferentes. Nada.",
      "Ótimo. Esse já é o segundo cartão.",
      "Uhum.",
      "O que você faria?",
      "Ok.",
      "Sim, pode cancelar.",
      "Obrigada.",
      "Na verdade, posso deixar uma avaliação em algum lugar? Quero comentar como você foi prestativa.",
      "Você também. Tchau.",
    ],
    atendente: [
      "Central Aurora, aqui é a Sofia. Como posso ajudar?",
      "Claro, consigo fazer isso. Qual é o novo endereço?",
      "Entendi. E o CEP?",
      "Perfeito, endereço atualizado. Qual era a outra coisa?",
      "Sinto muito por isso. A luz do chip chega a acender?",
      "Já tentou a função de aproximação, o NFC?",
      "Entendi. Pode tentar inserir o cartão em outra maquininha, se tiver à mão?",
      "Certo, isso indica um defeito no chip.",
      "Sinto muito mesmo. Deixa eu ver sua conta aqui. Vejo que o primeiro foi trocado em março.",
      "Então eu tenho duas opções. Posso enviar uma segunda via para o seu novo endereço, ou estornar a anuidade integralmente.",
      "Sinceramente, se for o segundo caso, eu pediria o estorno. Também posso adicionar um cupom de 10% de desconto na próxima anuidade.",
      "E você gostaria que eu cancelasse o cartão adicional que você pediu também? Ele ainda não foi enviado.",
      "Feito. Então fica assim: estorno integral da anuidade do cartão, o cartão adicional foi cancelado, e o cupom de desconto está no seu e-mail.",
      "Mais alguma coisa?",
      "Que gentileza sua. Tem um link no e-mail. Tenha um ótimo dia.",
    ],
  },
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

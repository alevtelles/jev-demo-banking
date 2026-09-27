import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const state = {
  transcricao_ligacao: [
    { falante: "atendente", texto: "Central Aurora, aqui é a Sofia. Como posso ajudar?" },
    { falante: "cliente", texto: "Oi. Na verdade são duas coisas. Primeiro, eu me mudei no mês passado, preciso atualizar meu endereço." },
    { falante: "atendente", texto: "Claro, consigo fazer isso. Qual é o novo endereço?" },
    { falante: "cliente", texto: "É Rua do Canal, 14, apartamento 3B." },
    { falante: "atendente", texto: "Entendi. E o CEP?" },
    { falante: "cliente", texto: "01012-000." },
    { falante: "atendente", texto: "Perfeito, endereço atualizado. Qual era a outra coisa?" },
    { falante: "cliente", texto: "Meu cartão Aurora parou de ser lido na maquininha. Peguei ele há algumas semanas." },
    { falante: "atendente", texto: "Sinto muito por isso. A luz do chip chega a acender?" },
    { falante: "cliente", texto: "Não." },
    { falante: "atendente", texto: "Já tentou a função de aproximação, o NFC?" },
    { falante: "cliente", texto: "Sim, também não funciona." },
    { falante: "atendente", texto: "Entendi. Pode tentar inserir o cartão em outra maquininha, se tiver à mão?" },
    { falante: "cliente", texto: "Já tentei em duas diferentes. Nada." },
    { falante: "atendente", texto: "Certo, isso indica um defeito no chip." },
    { falante: "cliente", texto: "Ótimo. Esse já é o segundo cartão." },
    { falante: "atendente", texto: "Sinto muito mesmo. Deixa eu ver sua conta aqui. Vejo que o primeiro foi trocado em março." },
    { falante: "cliente", texto: "Uhum." },
    { falante: "atendente", texto: "Então eu tenho duas opções. Posso enviar uma segunda via para o seu novo endereço, ou estornar a anuidade integralmente." },
    { falante: "cliente", texto: "O que você faria?" },
    { falante: "atendente", texto: "Sinceramente, se for o segundo caso, eu pediria o estorno. Também posso adicionar um cupom de 10% de desconto na próxima anuidade." },
    { falante: "cliente", texto: "Ok." },
    { falante: "atendente", texto: "E você gostaria que eu cancelasse o cartão adicional que você pediu também? Ele ainda não foi enviado." },
    { falante: "cliente", texto: "Sim, pode cancelar." },
    { falante: "atendente", texto: "Feito. Então fica assim: estorno integral da anuidade do cartão, o cartão adicional foi cancelado, e o cupom de desconto está no seu e-mail." },
    { falante: "cliente", texto: "Obrigada." },
    { falante: "atendente", texto: "Mais alguma coisa?" },
    { falante: "cliente", texto: "Na verdade, posso deixar uma avaliação em algum lugar? Quero comentar como você foi prestativa." },
    { falante: "atendente", texto: "Que gentileza sua. Tem um link no e-mail. Tenha um ótimo dia." },
    { falante: "cliente", texto: "Você também. Tchau." },
  ],
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

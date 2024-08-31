async function ChoiceDuelCard(){
  const dialogOptions = {
    width: 560,
    height: 400
  };

  const myDialog = new Dialog({
    title: game.i18n.localize("dialog.duel.dialogtitle"),
    content: await renderTemplate('systems/ronin-saga/templates/dialog/choice-duel-card.hbs'),
    buttons: {
      button0:{
        label: game.i18n.localize("dialog.button.validate"),
        callback: (html) => {
          const radioValue =  html[0].querySelector('input[name="duelcard"]:checked').value;
          sendCardInChat(radioValue);
        },
        icon: `<i class="fa-regular fa-message"></i>`
      }
    },
    default: "button0"
  }, dialogOptions).render(true);
};

async function sendCardInChat(card){
  const chatData = {
    author: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: await renderTemplate('systems/ronin-saga/templates/chat/duel-card.hbs', {card:card}),
    flags: {"ronin-saga":{cardback: true}}
  };

  ChatMessage.create(chatData);
}

import RoninCharacterActorSheet from "./RoninCharacterActorSheet.js";
import RoninCreatureActorSheet from "./RoninCreatureActorSheet.js";

Hooks.once("init", function(){
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ronin-saga", RoninCharacterActorSheet, { types: ["character"], makeDefault: true });
  Actors.registerSheet("ronin-saga", RoninCreatureActorSheet, { types: ["creature"], makeDefault: true });
});

Hooks.on("renderChatMessage", (chatMessage, [html], messageData) => {
  let flags = messageData.message.flags;
  if (flags && flags["ronin-saga"]){
    if (flags["ronin-saga"].cardback) {
      html.querySelector("img").src = "systems/ronin-saga/assets/card-back.jpg";
      html.querySelector("#cardname").remove();
      if (game.user.isGM) {
        html.querySelector(".duelcard").insertAdjacentHTML("beforeend", `<button id="reveal-button" type="button">${game.i18n.localize("duelcard.button.reveal")}</button>`);
        html.querySelector("#reveal-button").addEventListener("click", (event) => {
          console.log("reveal");
          let message = game.messages.get(event.target.closest("li").dataset.messageId);
          message.setFlag("ronin-saga", "cardback", false);
        });
      }
    }
  }
});

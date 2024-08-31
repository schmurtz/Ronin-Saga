export default class RoninCharacterActorSheet extends ActorSheet{

  static get defaultOptions(){
    return foundry.utils.mergeObject( super.defaultOptions,{
      template: 'systems/ronin-saga/templates/character-sheet.html',
      width: 825,
      height: 830,
      classes:["character", "ronin", "sheet", "actor"],
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "recto" }]
    });
  }

  async getData() {
    const dataObject = super.getData();

    dataObject.actor.system.notes = await TextEditor.enrichHTML(dataObject.actor.system.notes);

    return dataObject;
  }

  activateListeners (html){
    super.activateListeners(html);
    html.find('.roll-stat').click(this.clickRollStat.bind(this));
    html.find('.roll-healing').click(this.clickRollHealing.bind(this));
  }

  async clickRollStat(event){
    event.preventDefault();
    const statId = event.target.dataset.stat;
    const statValue = this.actor.system[statId];

    let formule=`1d20+${statValue}`;
    const roll = await new Roll(formule).evaluate();

    const diceResult = roll.terms[0].results[0].result;
    let flavorData={
      stat:`sheet.ability.${statId}`,
      sugoi:(diceResult==20),
      baka:(diceResult==1)
    };

    const messageData= {
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      rollMode: 'roll',
      flavor: await renderTemplate('systems/ronin-saga/templates/chat/rollStatFlavor.hbs', flavorData)
    }
    await roll.toMessage(messageData);
  }

  async clickRollHealing(event){
    event.preventDefault();

    let formule=`1d6+${this.actor.system.brawn}`;
    const roll = await new Roll(formule).evaluate();

    const messageData= {
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      rollMode: 'roll',
      flavor: `<h1>${game.i18n.localize("sheet.healing")}</h1>`
    }
    await roll.toMessage(messageData);
  }
}

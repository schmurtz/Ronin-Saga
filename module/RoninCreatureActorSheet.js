export default class RoninCreatureActorSheet extends ActorSheet{

  static get defaultOptions(){
    return foundry.utils.mergeObject( super.defaultOptions,{
      template: 'systems/ronin-saga/templates/creature-sheet.html',
      width: 400,
      height: 400,
      classes:["creature", "ronin", "sheet", "actor"]
    });
  }

  async getData() {
    const dataObject = super.getData();

    dataObject.actor.system.description = await TextEditor.enrichHTML(dataObject.actor.system.description);

    return dataObject;
  }

  activateListeners (html){
    super.activateListeners(html);
    html.find('.rollmorale').click(this.clickRollMorale.bind(this));
    html.find('.rollweapon').click(this.clickRollWeapon.bind(this));
  }

  async clickRollMorale(event){
    event.preventDefault();

    let formule='1d20';
    const roll = await new Roll(formule).evaluate();

    let flavorData={
      stat:'creature.morale',
      sugoi:false,
      baka:false
    };

    const messageData= {
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      rollMode: 'roll',
      flavor: await renderTemplate('systems/ronin-saga/templates/chat/rollStatFlavor.hbs', flavorData)
    }
    await roll.toMessage(messageData);
  }

  async clickRollWeapon(event){
    event.preventDefault();

    let formule=this.actor.system.weapon.value;

    if (!Roll.validate(formule)){
      ui.notifications.warn("Weapon is not a valid formula.");
      return;
    }

    const roll = await new Roll(formule).evaluate();

    const weapon = this.actor.system.weapon.type;

    let flavorData={
      stat:weapon.trim().length === 0?game.i18n.localize("creature.weapon"):this.actor.system.weapon.type,
      sugoi:false,
      baka:false
    };

    const messageData= {
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      rollMode: 'roll',
      flavor: await renderTemplate('systems/ronin-saga/templates/chat/rollStatFlavor.hbs', flavorData)
    }
    await roll.toMessage(messageData);
  }
}

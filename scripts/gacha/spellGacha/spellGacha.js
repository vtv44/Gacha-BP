import { gachaBase } from "../gachaBase";
import { commonSpells } from "./spellItem/commonSpells";
import { divineSpells } from "./spellItem/divineSpells";
import { epicSpells } from "./spellItem/epicSpells";
import { legendarySpells } from "./spellItem/legendarySpells";
import { mythicSpells } from "./spellItem/mythicSpells";
import { rareSpells } from "./spellItem/rareSpells";
import { specialSpells } from "./spellItem/specialSpells";
import { unCommonSpell } from "./spellItem/unCommonSpell";

export class spellGacha extends gachaBase {
    constructor() {
        super()

        this.cost = 10
        this.buttonPos = {x: -22, y: 3, z: 300}
        this.gachaPos = {x: -29, y: 2, z: 300}
        this.returnPos = {x: 0, y: 0, z: 300}
    }

    common(player) {
        const randomSpell = commonSpells[this.randomInt(commonSpells.length) - 1]
        this.giveItem(player, randomSpell)
        // const {pos, tick} = commonAnimation[this.randomInt(commonAnimation) - 1]
        // player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} redstone_block`)
        // system.runTimeout(() => {
        //     this.giveItem(player, randomSpell)
        // }, tick)
    }

    unCommon(player) {
        const randomSpell = unCommonSpell[this.randomInt(unCommonSpell.length) - 1]
        this.giveItem(player, randomSpell)
    }
    
    rare(player) {
        const randomSpell = rareSpells[this.randomInt(rareSpells.length) - 1]
        this.giveItem(player, randomSpell)
    }
    
    epic(player) {
        const randomSpell = epicSpells[this.randomInt(epicSpells.length) - 1]
        this.giveItem(player, randomSpell)
    }
    
    legendary(player) {
        const randomSpell = legendarySpells[this.randomInt(legendarySpells.length) - 1]
        this.giveItem(player, randomSpell)
    }
    
    mythic(player) {
        const randomSpell = mythicSpells[this.randomInt(mythicSpells.length) - 1]
        this.giveItem(player, randomSpell)
    }
    
    divine(player) {
        const randomSpell = divineSpells[this.randomInt(divineSpells.length) - 1]
        this.giveItem(player, randomSpell)
    }
    
    special(player) {
        const randomSpell = specialSpells[this.randomInt(specialSpells.length) - 1]
        this.giveItem(player, randomSpell)
    }
}
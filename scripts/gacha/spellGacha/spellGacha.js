import { gachaBase } from "../gachaBase";
import { mythicWeapons } from "../weaponGacha/weaponItem/mythicWeapons";
import { commonSpells } from "./spellItem/commonSpells";
import { divineSpells } from "./spellItem/divineSpells";
import { epicSpells } from "./spellItem/epicSpells";
import { legendarySpells } from "./spellItem/legendarySpells";
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
        const randomWeapon = commonWeapons[this.randomInt(commonSpells.length) - 1]
        this.giveItem(player, randomWeapon)
        // const {pos, tick} = commonAnimation[this.randomInt(commonAnimation) - 1]
        // player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} redstone_block`)
        // system.runTimeout(() => {
        //     this.giveItem(player, randomWeapon)
        // }, tick)
    }

    unCommon(player) {
        const randomWeapon = unCommonWeapons[this.randomInt(unCommonSpell.length) - 1]
        this.giveItem(player, randomWeapon)
    }
    
    rare(player) {
        const randomWeapon = rareWeapons[this.randomInt(rareSpells.length) - 1]
        this.giveItem(player, randomWeapon)
    }
    
    epic(player) {
        const randomWeapon = epicWeapons[this.randomInt(epicSpells.length) - 1]
        this.giveItem(player, randomWeapon)
    }
    
    legendary(player) {
        const randomWeapon = legendaryWeapons[this.randomInt(legendarySpells.length) - 1]
        this.giveItem(player, randomWeapon)
    }
    
    mythic(player) {
        const randomWeapon = mythicWeapons[this.randomInt(mythicWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }
    
    divine(player) {
        const randomWeapon = divineWeapons[this.randomInt(divineSpells.length) - 1]
        this.giveItem(player, randomWeapon)
    }
    
    special(player) {
        const randomWeapon = specialWeapons[this.randomInt(specialSpells.length) - 1]
        this.giveItem(player, randomWeapon)
    }
}
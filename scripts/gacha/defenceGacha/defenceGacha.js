import { gachaBase } from "../gachaBase";
import { commonArmors } from "./defenceItem/commonArmors";
import { divineArmors } from "./defenceItem/divineArmors";
import { epicArmors } from "./defenceItem/epicArmors";
import { legendaryArmors } from "./defenceItem/legendaryArmors";
import { mythicArmors } from "./defenceItem/mythicArmors";
import { rareArmors } from "./defenceItem/rareArmors";
import { specialArmors } from "./defenceItem/specialArmors";
import { unCommonArmors } from "./defenceItem/unCommonArmors";

export class defenceGacha extends gachaBase {
    constructor() {
        super()

        this.cost = 10
        this.buttonPos = {x: 278, y: 3, z: 0}
        this.gachaPos = {x: 271, y: 2, z: 0}
        this.returnPos = {x: 300, y: 0, z: 0}
    }

    common(player) {
        const randomArmor = commonArmors[this.randomInt(commonArmors.length) - 1]
        this.giveItem(player, randomArmor)
        // const {pos, tick} = commonAnimation[this.randomInt(commonAnimation) - 1]
        // player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} redstone_block`)
        // system.runTimeout(() => {
        //     this.giveItem(player, randomArmor)
        // }, tick)
    }

    unCommon(player) {
        const randomArmor = unCommonArmors[this.randomInt(unCommonArmors.length) - 1]
        this.giveItem(player, randomArmor)
    }
    
    rare(player) {
        const randomArmor = rareArmors[this.randomInt(rareArmors.length) - 1]
        this.giveItem(player, randomArmor)
    }
    
    epic(player) {
        const randomArmor = epicArmors[this.randomInt(epicArmors.length) - 1]
        this.giveItem(player, randomArmor)
    }
    
    legendary(player) {
        const randomArmor = legendaryArmors[this.randomInt(legendaryArmors.length) - 1]
        this.giveItem(player, randomArmor)
    }
    
    mythic(player) {
        const randomArmor = mythicArmors[this.randomInt(mythicArmors.length) - 1]
        this.giveItem(player, randomArmor)
    }
    
    divine(player) {
        const randomArmor = divineArmors[this.randomInt(divineArmors.length) - 1]
        this.giveItem(player, randomArmor)
    }
    
    special(player) {
        const randomArmor = specialArmors[this.randomInt(specialArmors.length) - 1]
        this.giveItem(player, randomArmor)
    }
}
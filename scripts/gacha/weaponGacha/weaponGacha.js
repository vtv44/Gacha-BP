import { system } from "@minecraft/server";
import { gachaBase } from "../gachaBase";
import { commonWeapons } from "./weaponItem/commonWeapons";
import { unCommonWeapons } from "./weaponItem/unCommonWeapons";
import { rareWeapons } from "./weaponItem/rareWeapons";
import { epicWeapons } from "./weaponItem/epicWeapons";
import { legendaryWeapons } from "./weaponItem/legendaryWeapons";
import { mythicWeapons } from "./weaponItem/mythicWeapons";
import { divineWeapons } from "./weaponItem/divineWeapons";
import { specialWeapons } from "./weaponItem/specialWeapons";

export class weaponGacha extends gachaBase {
    constructor() {
        super()

        this.cost = 10
        this.gachaPos = {x: -325, y: 3, z: 0}
        this.returnPos = {x: -300, y: 0, z: 0}
    }

    common(player) {
        const randomWeapon = commonWeapons[this.randomInt(commonWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
        // const {pos, tick} = commonAnimation[this.randomInt(commonAnimation) - 1]
        // player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} redstone_block`)
        // system.runTimeout(() => {
        //     this.giveItem(player, randomWeapon)
        // }, tick)
    }

    unCommon(player) {
        const randomWeapon = unCommonWeapons[this.randomInt(unCommonWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }

    rare(player) {
        const randomWeapon = rareWeapons[this.randomInt(rareWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }

    epic(player) {
        const randomWeapon = epicWeapons[this.randomInt(epicWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }

    legendary(player) {
        const randomWeapon = legendaryWeapons[this.randomInt(legendaryWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }

    mythic(player) {
        const randomWeapon = mythicWeapons[this.randomInt(mythicWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }

    divine(player) {
        const randomWeapon = divineWeapons[this.randomInt(divineWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }

    special(player) {
        const randomWeapon = specialWeapons[this.randomInt(specialWeapons.length) - 1]
        this.giveItem(player, randomWeapon)
    }
}

const commonAnimation = [
    {pos: {x: 0, y: 10, z: 0}, tick: 20}
]
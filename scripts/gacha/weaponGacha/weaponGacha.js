import { system, world } from "@minecraft/server";
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
    static cost = 10
    static buttonPos = {x: -322, y: 3, z: 0}
    static cratePos = {x: -335.5, y: 3, z: 0.5}
    static gachaPos = {x: -328.5, y: 2, z: 0.5}
    static returnPos = {x: -299.5, y: 0, z: 0.5}
    static initialRotation = 90

    static gachaParticles() {
        const dimension = world.getDimension("overworld")
        const pos = this.cratePos
        const upPos = {x: pos.x, y: pos.y + 1.5, z: pos.z}

        dimension.spawnParticle("rpg:white_magic_circle", pos)
        dimension.spawnParticle("gacha:gacha_arc", pos)
        dimension.playSound("random.levelup", upPos, {pitch: 1.4})
        dimension.playSound("random.toast", upPos, {pitch: 2.5})

        system.runTimeout(() => {
            dimension.spawnParticle("gacha:gacha_effect_weapon", upPos)
            dimension.playSound("random.splash", upPos, {pitch: 1.5})
            dimension.playSound("firework.blast", upPos)
        }, 50)

        system.runTimeout(() => {
            dimension.spawnParticle("gacha:gacha_flash", upPos)
            dimension.playSound("random.totem", upPos, {pitch: 3, volume: 0.8})
            dimension.playSound("random.levelup", upPos, {pitch: 0.5})
        }, 60)
    }

    static common(player) {
        // 演出完成したら変更 一旦激きしょコード
        const randomWeapon = commonWeapons[this.randomInt(commonWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§f-COMMON-`)
        }, 90)
        // const {pos, tick} = commonAnimation[this.randomInt(commonAnimation) - 1]
        // player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} redstone_block`)
        // system.runTimeout(() => {
        //     this.giveItem(player, randomWeapon)
        // }, tick)
    }

    static unCommon(player) {
        const randomWeapon = unCommonWeapons[this.randomInt(unCommonWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§a-UNCOMMON-`)
        }, 90)
    }

    static rare(player) {
        const randomWeapon = rareWeapons[this.randomInt(rareWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§1=RARE=`)
        }, 90)
    }

    static epic(player) {
        const randomWeapon = epicWeapons[this.randomInt(epicWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§5=EPIC=`)
        }, 90)
    }

    static legendary(player) {
        const randomWeapon = legendaryWeapons[this.randomInt(legendaryWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§6=LEGENDARY=`)
        }, 90)
    }

    static mythic(player) {
        const randomWeapon = mythicWeapons[this.randomInt(mythicWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§d=MYTHIC=`)
        }, 90)
    }

    static divine(player) {
        const randomWeapon = divineWeapons[this.randomInt(divineWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§o§b-=DIVINE=-`)
        }, 90)
    }

    static special(player) {
        const randomWeapon = specialWeapons[this.randomInt(specialWeapons.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomWeapon)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§k§4mm§r§l§4 !!SPECIAL!! §kmm`)
        }, 90)
    }
}

const commonAnimation = [
    {pos: {x: 0, y: 10, z: 0}, tick: 20}
]
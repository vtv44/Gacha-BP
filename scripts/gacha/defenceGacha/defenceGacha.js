import { world, system } from "@minecraft/server";
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
    static cost = 10
    static buttonPos = {x: 278, y: 3, z: 0}
    static cratePos = {x: 264.5, y: 3, z: 0.5}
    static gachaPos = {x: 271.5, y: 2, z: 0.5}
    static returnPos = {x: 300.5, y: 0, z: 0.5}
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
            dimension.spawnParticle("gacha:gacha_effect_armor", upPos)
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
        const randomArmor = commonArmors[this.randomInt(commonArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§f-COMMON-`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
        // const {pos, tick} = commonAnimation[this.randomInt(commonAnimation) - 1]
        // player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} redstone_block`)
        // system.runTimeout(() => {
        //     this.giveItem(player, randomArmor)
        // }, tick)
    }

    static unCommon(player) {
        const randomArmor = unCommonArmors[this.randomInt(unCommonArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§a-UNCOMMON-`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static rare(player) {
        const randomArmor = rareArmors[this.randomInt(rareArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§1=RARE=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static epic(player) {
        const randomArmor = epicArmors[this.randomInt(epicArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§5=EPIC=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static legendary(player) {
        const randomArmor = legendaryArmors[this.randomInt(legendaryArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§6=LEGENDARY=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static mythic(player) {
        const randomArmor = mythicArmors[this.randomInt(mythicArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§d=MYTHIC=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static divine(player) {
        const randomArmor = divineArmors[this.randomInt(divineArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§o§b-=DIVINE=-`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static special(player) {
        const randomArmor = specialArmors[this.randomInt(specialArmors.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomArmor)
            player.onScreenDisplay.setTitle(" ")
            player.onScreenDisplay.updateSubtitle(`§l§k§4mm§r§l§4 !!SPECIAL!! §kmm`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
}
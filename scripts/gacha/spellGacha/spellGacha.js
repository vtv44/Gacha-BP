import { world, system } from "@minecraft/server";
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
    static cost = 10
    static buttonPos = {x: -22, y: 3, z: 300}
    static cratePos = {x: -35.5, y: 3, z: 300.5}
    static gachaPos = {x: -28.5, y: 2, z: 300.5}
    static returnPos = {x: 0.5, y: 0, z: 300.5}
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
            dimension.spawnParticle("gacha:gacha_effect_spell", upPos)
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
        const randomSpell = commonSpells[this.randomInt(commonSpells.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§f-COMMON-`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
        // const {pos, tick} = commonAnimation[this.randomInt(commonAnimation) - 1]
        // player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} redstone_block`)
        // system.runTimeout(() => {
        //     this.giveItem(player, randomSpell)
        // }, tick)
    }

    static unCommon(player) {
        const randomSpell = unCommonSpell[this.randomInt(unCommonSpell.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§a-UNCOMMON-`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static rare(player) {
        const randomSpell = rareSpells[this.randomInt(rareSpells.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§1=RARE=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static epic(player) {
        const randomSpell = epicSpells[this.randomInt(epicSpells.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§5=EPIC=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static legendary(player) {
        const randomSpell = legendarySpells[this.randomInt(legendarySpells.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§l§5=LEGENDARY=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static mythic(player) {
        const randomSpell = mythicSpells[this.randomInt(mythicSpells.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§l§d=MYTHIC=`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static divine(player) {
        const randomSpell = divineSpells[this.randomInt(divineSpells.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§l§o§b-=DIVINE=-`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
    
    static special(player) {
        const randomSpell = specialSpells[this.randomInt(specialSpells.length) - 1]
        system.runTimeout(() => {
            this.giveItem(player, randomSpell)
            player.onScreenDisplay.setActionBar(`§l§k§4mm§r§l§4 !!SPECIAL!! §kmm`)
        }, 90)

        system.runTimeout(() => {
            this.leaveGacha(player)
        }, 110)
    }
}
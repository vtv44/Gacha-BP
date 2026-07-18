import { EquipmentSlot, GameMode, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class dimensinalDriftSkill extends skillBase {
    constructor() {
        super()

        this.id = "§dディメンショナルドリフト"
        this.cooldown = 20 * 20
    }

    execute(player) {
        this.onCooldown(player)
        this.consumeItem(player)

        const dimension = player.dimension

        player.addEffect("speed", 16 * 20, {amplifier: 4, showParticles: false})
        player.addEffect("regeneration", 16 * 20, {amplifier: 4, showParticles: false})
        player.addEffect("invisibility", 16 * 20, {amplifier: 4, showParticles: false})
        player.addEffect("resistance", 16 * 20, {amplifier: 255, showParticles: false})
        player.addEffect("weakness", 16 * 20, {amplifier: 255, showParticles: false})

        const equip = player.getComponent("equippable")
        const head = equip.getEquipment(EquipmentSlot.Head)
        const chest = equip.getEquipment(EquipmentSlot.Chest)
        const legs = equip.getEquipment(EquipmentSlot.Legs)
        const feet = equip.getEquipment(EquipmentSlot.Feet)
        const off = equip.getEquipment(EquipmentSlot.Offhand)

        equip.setEquipment(EquipmentSlot.Head, null)
        equip.setEquipment(EquipmentSlot.Chest, null)
        equip.setEquipment(EquipmentSlot.Legs, null)
        equip.setEquipment(EquipmentSlot.Feet, null)
        equip.setEquipment(EquipmentSlot.Offhand, null)

        dimension.playSound("mob.warden.sonic_charge", player.location, {volume: 0.8, pitch: 2.5})

        system.runTimeout(() => {
            if (player.getGameMode() === GameMode.Spectator) return

            dimension.playSound("crossbow.shoot", player.location, {pitch: 0.5})

            equip.setEquipment(EquipmentSlot.Head, head)
            equip.setEquipment(EquipmentSlot.Chest, chest)
            equip.setEquipment(EquipmentSlot.Legs, legs)
            equip.setEquipment(EquipmentSlot.Feet, feet)
            equip.setEquipment(EquipmentSlot.Offhand, off)
        }, 16 * 20)
    }
}
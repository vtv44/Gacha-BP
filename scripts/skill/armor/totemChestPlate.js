import { EquipmentSlot, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class totemChestPlateSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6トーテムチェストプレート"
    }

    onHurtBefore(player, event) {
        const damage = event.damage
        const health = player.getComponent("health")
        const current = health.currentValue

        if (damage < current) return

        event.cancel = true

        system.run(() => {
            const dimension = player.dimension
            const location = player.location

            dimension.spawnParticle("kitpvp:wind_second_wind", location)
            dimension.playSound("random.totem", location, {volume: 0.6})
            dimension.playSound("random.break", location)

            health.resetToMaxValue()
            
            if (this.canAddEffect) {
                player.addEffect("resistance", 10 * 20, {amplifier: 4})
                player.addEffect("regeneration", 10 * 20, {amplifier: 4})
                player.addEffect("fire_resistance", 30 * 20)
            }

            player.getComponent("equippable").setEquipment(EquipmentSlot.Chest, null)
        })
    }
}
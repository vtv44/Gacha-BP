import { EquipmentSlot } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class breakArmorSKill extends skillBase {
    constructor() {
        super()

        this.id = "§6気まずさの破片"
        this.cooldown = 15 * 20
    }

    onDamage(player, event) {
        if (!this.canUse(player)) return

        this.consumeItem(player)
        this.onCooldown(player)

        const hurtEntity = event.hurtEntity
        const armor = player.getComponent("equippable")
        const hurtArmor = player.getComponent("equippable")

        for (const slot of slots) {
            armor.setEquipment(slot, null)
            hurtArmor.setEquipment(slot, null)
        }
        
        const dimension = player.dimension
        const pos = player.location
        const hurtPos = hurtEntity.location

        dimension.playSound("random.break", pos)
        dimension.playSound("random.break", hurtPos)

        dimension.spawnParticle("gacha:break_armor", {x: pos.x, y: pos.y + 1.4, z: pos.z})
        dimension.spawnParticle("gacha:break_armor", {x: hurtPos.x, y: hurtPos.y + 1.4, z: hurtPos.z})
    }
}

const slots = [
    EquipmentSlot.Head,
    EquipmentSlot.Chest,
    EquipmentSlot.Legs,
    EquipmentSlot.Feet,
    EquipmentSlot.Mainhand,
]
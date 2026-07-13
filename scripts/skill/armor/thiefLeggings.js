import { EquipmentSlot, ItemStack } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class thiefLeggingsSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6泥棒の脚甲"
    }

    onHurt(player, event) {
        const damager = event.damageSource.damagingEntity
        if (!damager) return

        const mainHand = damager.getComponent("inventory").container.getSlot(damager.selectedSlotIndex)
        const item = mainHand.getItem()
        if (!item) return

        mainHand.setItem(null)
        player.getComponent("equippable").setEquipment(EquipmentSlot.Legs, null)
        player.getComponent("inventory").container.addItem(item)
        
        player.sendMessage(`${item.nameTag}§r§lを盗んだ！`)
        player.playSound("random.levelup", {pitch: 2})
        player.dimension.spawnParticle("rca:just_guard", player.location)

        damager.sendMessage(`${item.nameTag}§r§lを盗まれた！`)
        damager.playSound("random.hurt")
    }
}
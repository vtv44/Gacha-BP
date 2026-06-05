import { EquipmentSlot } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class thiefLeggingsSkill extends skillBase {
    // 気が向いたら音とパーティクル着ける
    constructor() {
        super()

        this.id = "§6泥棒の脚甲"
    }

    onHurt(player, event) {
        const damager = event.damageSource.damagingEntity

        const mainHand = damager.getComponent("inventory").container.getSlot(damager.selectedSlotIndex)
        const item = mainHand.getItem()
        if (!item) return

        mainHand.setItem(null)
        player.getComponent("equippable").setEquipment(EquipmentSlot.Legs, null)
        player.getComponent("inventory").container.addItem(item)

        player.sendMessage(`${item.nameTag}§r§lを盗んだ！`)
    }
}
import { ItemStack } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class leapFeatherSkill extends skillBase {

    constructor() {
        super()

        this.id = "§5鳳の羽根"
        this.cooldown = 1 * 20
    }

    execute(player) {
        this.onCooldown(player)
        const dimension = player.dimension
        const pos = player.location
        const dir = player.getViewDirection()

        dimension.playSound("mob.enderdragon.flap", pos, {volume: 0.7, pitch: 2})
        dimension.spawnParticle("minecraft:wind_explosion_emitter", pos)

        player.applyKnockback({x: dir.x * 6, z: dir.z * 6}, dir.y * 2)
        player.addEffect("slow_falling", 2 * 20)

        const mainHand = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex)
        const item = mainHand.getItem()
        if (item.amount - 1 <= 0) {
            mainHand.setItem(null)
            return
        }
        const feather = new ItemStack(item.typeId, item.amount - 1)
        feather.nameTag = item.nameTag
        feather.setLore(item.getLore() ? item.getLore() : null)
        mainHand.setItem(feather)
    }
}
import { ItemStack, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class pushFeatherSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1大鶏の羽根"
        this.cooldown = 1 * 20
    }

    execute(player) {
        this.onCooldown(player)
        const dimension = player.dimension
        const pos = player.location
        const dir = player.getViewDirection()
        const atkPos = {
            x: pos.x + dir.x * 4,
            y: pos.y + dir.y * 4 + 1.2,
            z: pos.z + dir.z * 4
        }

        const targets = this.getTargets(player, atkPos, 3)
        for (const t of targets) {
            t.applyKnockback({x: dir.x * 4, z: dir.z * 4}, dir.y)
        }

        dimension.playSound("mob.enderdragon.flap", pos, {volume: 0.4, pitch: 1.5})
        for (let i = 0; i <= 7; i++) {

            system.runTimeout(() => {
                const emitterPos = {
                    x: pos.x + dir.x * i,
                    y: pos.y + dir.y * i + 0.8,
                    z: pos.z + dir.z * i
                }
                if (emitterPos.y < -64) return
                dimension.spawnParticle("rca:sweep_white", emitterPos)
                dimension.spawnParticle("rca:star_blue", emitterPos)
                dimension.playSound("wind_charge.burst", emitterPos, {volume: 0.3, pitch: 1.2})
            }, i)
        }

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
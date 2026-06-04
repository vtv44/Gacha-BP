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
        this.consumeItem(player)

        const dimension = player.dimension
        const pos = player.location
        const dir = player.getViewDirection()

        dimension.playSound("mob.enderdragon.flap", pos, {volume: 0.7, pitch: 2})
        dimension.spawnParticle("minecraft:wind_explosion_emitter", pos)

        player.applyKnockback({x: dir.x * 6, z: dir.z * 6}, dir.y * 2)
        player.addEffect("slow_falling", 2 * 20)
    }
}
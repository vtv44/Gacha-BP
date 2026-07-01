import { EntityDamageCause, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class hookshotSkill extends skillBase {
    constructor() {
        super()

        this.id = "§dフックショット"
        this.cooldown = 5 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const pos = player.location
        const dir = player.getViewDirection()

        for (let i = 1; i <= 120; i++) {
            const particlePos = {
                x: pos.x + dir.x * (i / 2),
                y: pos.y + dir.y * (i / 2) + 1.52,
                z: pos.z + dir.z * (i / 2)
            }
            const testBlock = dimension.getBlock(particlePos)
            if (!testBlock || testBlock.typeId !== "minecraft:air") break;

            if (i % 2 === 0) {
                dimension.spawnParticle("gacha:chain_xz", particlePos)
            } else {
                dimension.spawnParticle("gacha:chain_y", particlePos)
            }
        }

        const block = player.getBlockFromViewDirection({maxDistance: 60})?.block
        if (!block) {
            player.playSound("random.click", {pitch: 1.2, volume: 0.6})
            return
        }

        const bPos = block.location
        const kb = {
            x: (bPos.x - pos.x) / 5,
            y: (bPos.y - pos.y) / 8,
            z: (bPos.z - pos.z) / 5
        }

        player.playSound("mob.blaze.shoot")
        dimension.spawnParticle("minecraft:wind_explosion_emitter", player.location)
        dimension.spawnParticle("minecraft:critical_hit_emitter", {x: bPos.x + 0.5, y: bPos.y + 0.5, z: bPos.z + 0.5})

        player.applyImpulse(kb)

        player.addEffect("hunger", 30, {amplifier: 9, showParticles: false})

        this.onCooldown(player)
    }

    onHurtBefore(player, event) {
        const cause = event.damageSource.cause
        if (cause === EntityDamageCause.fall) event.cancel = true
    }
}
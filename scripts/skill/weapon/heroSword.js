import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class heroSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1英雄の剣"
        this.cooldown = 10 * 20
    }

    execute(player) {
        this.onCooldown(player)
        const dimension = player.dimension
        const location = player.location
        const dir = player.getViewDirection()
        const atkPos = {
            x: location.x + dir.x * 2.5,
            y: location.y + dir.y + 1.4,
            z: location.z + dir.z * 2.5,
        }
        dimension.spawnParticle("rca:sweep_white", atkPos)
        dimension.playSound("random.pop", atkPos, {pitch: 0.4, volume: 1.2})
        const targets = this.getTargets(player, atkPos, 2)
        for (const t of targets) {
            t.applyDamage(4, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
        }

        system.runTimeout(() => {
            dimension.spawnParticle("rca:sweep_black_v", atkPos)
            dimension.playSound("random.pop", atkPos, {pitch: 0.8, volume: 0.5})
        }, 2)

        system.runTimeout(() => {
            const location = player.location
            const dir = player.getViewDirection()
            const atkPos = {
                x: location.x + dir.x * 4,
                y: location.y + dir.y + 1.4,
                z: location.z + dir.z * 4,
            }
            dimension.spawnParticle("rca:shock_wave_spread", {x: location.x, y: location.y + 1.4, z: location.z})
            dimension.spawnParticle("rca:shock_wave", atkPos)
            dimension.playSound("random.explode", atkPos, {pitch: 0.8, volume: 0.5})
            player.applyKnockback({x: dir.x * 2, z: dir.z * 2}, 0.3)
            const targets = this.getTargets(player, atkPos, 4)
            for (const t of targets) {
                t.applyDamage(8, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
            }
        }, 8)
    }
}
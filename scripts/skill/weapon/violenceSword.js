import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class vionlenceSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5暴虐剣 ガスト"
        this.cooldown = 6 * 20
    }

    execute(player) {
        this.onCooldown(player)

        const dimension = player.dimension
        const pos = player.location
        const dir = player.getViewDirection()

        for (let i = 1; i <= 9; i++) {
            player.playSound("random.click", {volume: 0.8})

            system.runTimeout(() => {
                const atkPos = {
                    x: pos.x + dir.x * i * 2,
                    y: pos.y + dir.y * i * 2 + 1.2,
                    z: pos.z + dir.z * i * 2,
                }

                dimension.spawnParticle("rca:error_pink", atkPos)
                dimension.spawnParticle("rca:sweep_purple_cross", atkPos)
                dimension.playSound("mob.skeleton.death", atkPos, {volume: 0.6, pitch: 0.8})

                for (const t of this.getTargets(player, atkPos, 2)) {
                    t.applyDamage(6, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
                }
            }, i + 4)
        }
    }
}
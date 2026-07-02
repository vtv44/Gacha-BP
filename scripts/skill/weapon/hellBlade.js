import { EntityDamageCause, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class hellBladeSKill extends skillBase {
    constructor() {
        super()

        this.id = "§d地獄の大剣"
        this.cooldown = 15 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const location = player.location
        const dir = player.getViewDirection()

        this.onCooldown(player)

        player.addEffect("slowness", 2 * 20, {amplifier: 2, showParticles: false})
        if (this.canAddEffect) player.addEffect("strength", 20 * 20, {amplifier: 1})

        for (let i = 1; i <= 9; i++) {

            let x = dir.x;
            let z = dir.z;

            const len = Math.sqrt(x * x + z * z);

            if (len < 0.0001) return;

            x /= len;
            z /= len;
            
            const atkPos = {
                x: location.x + x * i,
                y: location.y,
                z: location.z + z * i,
            }

            dimension.spawnParticle("gacha:knockback_stone", atkPos)
            dimension.playSound("mob.evocation_illager.cast_spell", atkPos, {pitch: 2, volume: 0.5})

            system.runTimeout(() => {
                dimension.spawnParticle("gacha:hell_punishment", atkPos)
                dimension.playSound("mob.zombie.remedy", atkPos, {pitch: 1.8, volume: 0.5})

                for (const t of this.getTargets(player, atkPos, 2)) {
                    t.applyDamage(10, {damagingEntity: player, cause: EntityDamageCause.none})
                    dimension.spawnParticle("gacha:blood", t.location)
                }
            }, 10)

            system.runTimeout(() => {
                for (const t of this.getTargets(player, atkPos, 2)) {
                    t.applyDamage(10, {damagingEntity: player, cause: EntityDamageCause.none})
                    dimension.spawnParticle("gacha:blood", t.location)
                }
            }, 25)
        }
    }
}
import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class enhanceFernSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6エンハンスファーン"
        this.cooldown = 3 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const pos = player.location
        this.onCooldown(player)

        if (!player.isSneaking) {
            dimension.spawnParticle("ptl:ice_ball_small", pos)
            dimension.playSound("mob.evocation_illager.cast_spell", pos)

            const dir = player.getViewDirection()
            let x = dir.x
            let z = dir.z

            const len = Math.sqrt(x * x + z * z)

            if (len < 0.0001) return

            x /= len
            z /= len

            for (let i = 2; i <= 22; i++) {
                system.runTimeout(() => {
                    const atkPos = {
                        x: pos.x + x * (i * 2),
                        y: pos.y,
                        z: pos.z + z * (i * 2),
                    }

                    dimension.spawnParticle("gacha:ice_protrude", atkPos)
                    dimension.playSound("random.glass", atkPos, {volume: 1, pitch: 0.8})

                    for (const t of this.getTargets(player, atkPos, 3)) {
                        t.applyDamage(7, {damagingEntity: player, cause: EntityDamageCause.magic})
                        t.addEffect("slowness", 2 * 20, {amplifier: 1})
                        t.playSound("random.glass", {pitch: 1.2})
                    }
                }, i * 3)
            }
        } else {
            const targets = this.getTargets(player, pos, 6)

            if (targets.length === 0) {
                player.sendMessage("§c周囲にプレイヤーがいない")
                player.playSound("note.bit", {pitch: 0.8})
            }

            for (const t of targets) {
                this.iceDrop(t,player)

                dimension.spawnParticle("ptl:fire_spark", {x: pos.x, y: pos.y + 1.2, z: pos.z})
                dimension.playSound("mob.evocation_illager.cast_spell", pos)
            }
        }
    }

    iceDrop(t,player) {
        const dimension = t.dimension
        const p = t.location
        const ice = dimension.spawnEntity("gacha:ice_lump", {x: p.x, y: p.y + 10, z: p.z})

        for (let i = 2; i <= 40; i++) {
            system.runTimeout(() => {
                if (!ice.isValid) return

                const location = ice.location

                if (!dimension.getBlock(location).below().isAir || i === 40) {
                    ice.remove()

                    dimension.spawnParticle("minecraft:knockback_roar_particle", location)
                    dimension.playSound("random.glass", location, {pitch: 0.8})

                    for (const target of this.getTargets(player, location, 3)) {
                        target.applyDamage(8, {damagingEntity: player, cause: EntityDamageCause.selfDestruct})
                        target.addEffect("slowness", 10 * 20, {amplifier: 1})
                        target.addEffect("blindness", 1 * 20)
                    }
                }
            }, i)
        }
    }
}
import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class crossSlashSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6アメノオハバリノツルギ"
        this.cooldown = 20 * 20 
    }

    execute(player) {
        this.onCooldown(player)

        const dimension = player.dimension
        const location = player.location
        const dir = player.getViewDirection()
        const atkPos = {
            x: location.x + dir.x * 3.5,
            y: location.y + dir.y * 3.5 + 1,
            z: location.z + dir.z * 3.5,
        }

        dimension.spawnParticle("rca:target_cyan", atkPos)
        dimension.playSound("voice.harubagu_6", {
            x: location.x + dir.x * 2,
            y: location.y + dir.y * 2,
            z: location.z + dir.z * 2
        })

        system.runTimeout(() => {
            const worldUp = {x: 0, y: 1, z: 0}

            dimension.playSound("mob.warden.sonic_boom", atkPos, {pitch: 1.4, volume: 0.5})

            let particlePos = {
                x: dir.y * worldUp.z - dir.z * worldUp.y,
                y: dir.z * worldUp.x - dir.x * worldUp.z, 
                z: dir.x * worldUp.y - dir.y * worldUp.x
            }
            const len = Math.hypot(particlePos.x, particlePos.y, particlePos.z)

            particlePos = {
                x: particlePos.x / len,
                y: particlePos.y / len,
                z: particlePos.z / len
            }
            
            for (let i = -10; i <= 10; i++) {
                const pos = {
                    x: atkPos.x + particlePos.x * i,
                    y: atkPos.y,
                    z: atkPos.z + particlePos.z * i
                }
                dimension.spawnParticle("gacha:cross_slash_h", pos)
                dimension.spawnParticle("gacha:blue_volt", pos)
                dimension.playSound("mob.vex.charge", pos, {pitch: 2, volume: 0.2})
                for (const t of this.getTargets(player, pos, 2)) {
                    t.applyDamage(10, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
                    t.addEffect("slowness", 4 * 20, {amplifier: 4})
                }
            }

            system.runTimeout(() => {
                dimension.playSound("mob.warden.sonic_boom", atkPos, {pitch: 1.8, volume: 0.5})

                for (let i = 0; i <= 20; i++) {
                    const pos = {
                        x: atkPos.x,
                        y: atkPos.y + i - 10,
                        z: atkPos.z
                    }
                    dimension.spawnParticle("gacha:cross_slash_v", pos)
                    dimension.spawnParticle("gacha:blue_volt", pos)
                    dimension.playSound("mob.vex.charge", pos, {pitch: 2, volume: 0.2})
                    for (const t of this.getTargets(player, pos, 2)) {
                        t.applyDamage(10, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
                        t.addEffect("slowness", 4 * 20, {amplifier: 4})
                    }
                }
            }, 24)
        }, 14)
    }
}
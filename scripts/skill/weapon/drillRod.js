import { EntityDamageCause, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class drillRodSkill extends skillBase {

    constructor() {
        super()

        this.id = "§6=魔杖= -ラ・グルトア-"
        this.cooldown = 25 * 20
    }

    execute(player) {
        this.onCooldown(player)
        const dimension = player.dimension
        const dir = player.getViewDirection()
        const location = player.location
        const particlePos = {
            x: location.x + dir.x * 1.2,
            y: location.y + dir.y + 1.4,
            z: location.z + dir.z * 1.2,
        }
        dimension.spawnParticle("rpg:red_light_blue_v_magic_circle", particlePos)
        dimension.playSound("portal.portal", particlePos, {pitch: 1.5, volume: 0.6})
        
        system.runTimeout(() => {
            dimension.playSound("mob.elderguardian.curse", particlePos, {pitch: 0.8})
            for (let i = 1; i <= 30; i++) {
                const atkPos = {
                    x: location.x + dir.x * i,
                    y: location.y + dir.y * i + 1.4,
                    z: location.z + dir.z * i,
                }
                const {x, y, z} = atkPos
                if (y < -64) return
                dimension.spawnParticle("rpg:red_light_blue_magic_smoke", atkPos)
                dimension.playSound("mob.irongolem.hit", atkPos, {pitch: 0.8, volume: 0.5})
                dimension.runCommand(`fill ${x + 1} ${y + 1} ${z + 1} ${x - 1} ${y - 1} ${z - 1} air`)
                const targets = this.getTargets(player, atkPos, 2)
                for (const t of targets) {
                    t.applyDamage(16, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
                }
            }
        }, 58)
    }
}
import { EntityDamageCause, InputPermissionCategory, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class railgunSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6超電磁砲"
        this.cooldown = 5 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const pos = player.location
        const dir = player.getViewDirection()

        this.consumeItem(player)

        dimension.playSound("voice.chicken_1", pos)

        player.addEffect("slowness", 20, {amplifier: 255, showParticles: false})
        const input = player.inputPermissions
        input.setPermissionCategory(InputPermissionCategory.Camera, false)

        system.runTimeout(() => {
            input.setPermissionCategory(InputPermissionCategory.Camera, true)

            dimension.playSound("mob.warden.sonic_boom", pos, {volume: 0.8, pitch: 0.7})

            for (let i = 1; i <= 20; i++) {
                let x = dir.x;
                let z = dir.z;

                const len = Math.sqrt(x * x + z * z);

                if (len < 0.0001) return;

                x /= len;
                z /= len;
                
                const atkPos = {
                    x: pos.x + x * i,
                    y: pos.y + 1.2,
                    z: pos.z + z * i,
                }

                if (atkPos.y > -58) {
                    dimension.spawnParticle("gacha:railgun_center", atkPos)
                    dimension.spawnParticle("gacha:railgun_volt", atkPos)

                    dimension.runCommand(
                        `fill 
                        ${atkPos.x + 2} ${atkPos.y + 2} ${atkPos.z + 2} 
                        ${atkPos.x - 2} ${atkPos.y - 1} ${atkPos.z - 2}
                        air`
                    )
                }

                this.damage(player, atkPos)

                for (let k = 1; k <= 4; k++) {
                    system.runTimeout(() => {
                        this.damage(player, atkPos)
                    }, 10 * k)
                }
            }
        }, 20)
    }

    damage(player, location) {
        const kill = this.getTargets(player, location, 1)
        for (const k of kill) {
            k.applyDamage(999, {damagingEntity: player, cause: EntityDamageCause.magic})
        }

        const targets = this.getTargets(player, location, 4)
        for (const t of targets) {
            t.applyDamage(5, {damagingEntity: player, cause: EntityDamageCause.magic})
            if (this.canAddEffect(player)) {
                t.addEffect("slowness", 2 * 20, {amplifier: 255})
            }
        }
    }
}
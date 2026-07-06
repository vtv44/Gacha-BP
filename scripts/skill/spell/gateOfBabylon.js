import { EntityDamageCause, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class gateOfBabylonSkill extends skillBase {
    constructor() {
        super()

        this.id = "§b王の財宝",
        this.cooldown = 1 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const location = player.location
        const dir = player.getViewDirection()

        if (player.isSneaking) {
            const targets = this.getTargets(player, location, 15)

            if (!targets[0]) {
                player.onScreenDisplay.setActionBar(`§c周囲に敵がいない`)
                player.playSound("random.pop")
                return
            }

            this.onCooldown(player)

            for (const t of targets) {
                t.addEffect("weakness", this.cooldown, {amplifier: 3})
                t.addEffect("slowness", this.cooldown, {amplifier: 4})
                t.addEffect("blindness", this.cooldown, {amplifier: 3})

                this.claerAllEffect(t)
                this.clearEffectSetTime(t, this.cooldown)

                dimension.spawnParticle("gacha:chain", t.location)
                dimension.playSound("scrape", t.location, {pitch: 0.8})
                t.playSound("mob.blaze.death", {pitch: 1.5})
            }

            player.spawnParticle("minecraft:example_flipbook", location)
            player.playSound("block.bell.hit", {volume: 0.5, pitch: 3})

            if (targets.length <= 2) {
                player.addEffect("resistance", this.cooldown, {amplifier: 2, showParticles: false})
            } else if (targets.length <= 4) {
                player.addEffect("resistance", this.cooldown, {amplifier: 2, showParticles: false})
                player.addEffect("regeneration", this.cooldown, {amplifier: 2, showParticles: false})
            } else if (targets.length <= 6) {
                player.addEffect("resistance", this.cooldown, {amplifier: 2, showParticles: false})
                player.addEffect("regeneration", this.cooldown, {amplifier: 2, showParticles: false})
                player.addEffect("instant_health", 2 * 20, {amplifier: 2, showParticles: false})
            }

        } else {
            // 攻撃判定を厳格化予定
            this.onCooldown(player)
            
            const len = Math.hypot(dir.x, dir.z)
            const flatForward = {
                x: dir.x / len,
                y: 0,
                z: dir.z / len
            }

            const right = {
                x: flatForward.z,
                y: 0,
                z: -flatForward.x
            }

            dimension.playSound(`voice.harubagu_${Math.floor(Math.random() * 2) + 7}`, {
                x: location.x + dir.x * 1.1,
                y: location.y + dir.y * 1.1,
                z: location.z + dir.z * 1.1
            })

            for (let i = 0; i <= 19; i++) {
                
                const offset = (Math.random() - 0.5) * 6
                const rand = Math.random() * 3
                const vector3 = {
                    x: location.x + right.x * offset,
                    y: location.y + rand + 0.4,
                    z: location.z + right.z * offset,
                }

                system.runTimeout(() => {
                    this.arrowShot(player, vector3, dir, player.dimension, 10)
                }, i * 1);
            }
        }
    }

    arrowShot(player, location, dir, dimension, count = 20) {
        const atkPos = {
            x: player.location.x + dir.x * 4,
            y: player.location.y + 1.2,
            z: player.location.z + dir.z * 4
        }
        
        dimension.spawnParticle("gacha:babylon_gate", location)
        system.runTimeout(() => {

            dimension.playSound("mob.blaze.shoot", location, {volme: 0.5, pitch: 3})
            for (let i = 0; i <= count; i++) {
                const pos = {
                    x: location.x + dir.x * (i / 2),
                    y: location.y + dir.y * (i / 2),
                    z: location.z + dir.z * (i / 2),
                }

                dimension.spawnParticle("rpg:yellow_smoke", pos)
                dimension.playSound("random.pop", pos, {pitch: 0.35, volume: 0.01})
            }

            const targets = this.getTargets(player, atkPos, 7)
            for (const t of targets) {
                if (this.posCheck(atkPos, t.location)) {
                    t.applyDamage(4, {damagingEntity: player, cause: EntityDamageCause.selfDestruct})
                }
            }
        }, 20)
    }

    posCheck(pos, pos2) {
        const {x, y, z} = pos

        return (
            x - 5 <= pos2.x && pos2.x <= x + 5 &&
            y - 1 <= pos2.y && pos2.y <= y + 3.5 &&
            z - 5 <= pos2.z && pos2.z <= z + 5
        )
    }
}
import { EntityDamageCause, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class gateOfBabylonSkill extends skillBase {
    // 要修正　攻撃判定、34行
    constructor() {
        super()

        this.id = "§b王の財宝",
        this.cooldown = 5 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const location = player.location
        const dir = player.getViewDirection()

        this.onCooldown(player)

        if (player.isSneaking) {
            const headPos = player.getHeadLocation()
            const teamScore = world.scoreboard.getObjective("team").getScore(player)
            const targets = player.getEntitiesFromViewDirection({
                maxDistance: 20,
                scoreOptions: [{
                    objective: "team",
                    minScore: teamScore,
                    maxScore: teamScore,
                    exclude: true
                }],
            })
            dimension.playSound("random.bow", location)

            for (const t of targets) {
                t.runCommand("inputpermission set @s movement disabled")
                t.applyDamage(4)
                t.addEffect("slowness", 12 * 20, {amplifier: 4})
                t.addEffect("weakness", 12 * 20, {amplifier: 4})
                t.removeEffect("resistance")
                dimension.spawnParticle("rca:chain", t.location)
                dimension.playSound("mob.elderguardian.curse", t.location)

                system.runTimeout(() => {
                    t.runCommand("inputpermission set @s movement enabled")
                    t.playSound("random.click")
                }, 60)
            }

            for (let i = 1; i <= 40; i++) {
                const pos = {
                    x: headPos.x + dir.x * (i / 2),
                    y: headPos.y + dir.y * (i / 2),
                    z: headPos.z + dir.z * (i / 2)
                }
                dimension.playSound("break.heavy_core", pos, {pitch: 0.7, volume: 0.4})

                if (i % 2 === 0) {
                    dimension.spawnParticle("gacha:chain_y", pos)
                } else {
                    dimension.spawnParticle("gacha:chain_xz", pos)
                }
            }
        } else {
            const {x, y, z} = location
            dimension.playSound(`voice.harubagu_${Math.floor(Math.random() * 2) + 7}`, {
                x: x + dir.x * 1,
                y: y + dir.y * 1,
                z: z + dir.z * 1
            })

            const right = {x: -dir.z, y: 0, z: dir.x}
            const center = {
                x: x + dir.x * -0.8,
                y: y + 1.5 + dir.y * -0.8,
                z: z + dir.z * -0.8
            }
            for (let i = 0; i <= 19; i++) {
                const rx = (Math.random() - 0.5) * 5
                const ry = (Math.random() - 0.5) * 1.4
                const vector3 = {
                    x: center.x + right.x * rx,
                    y: center.y + 1.4 * ry,
                    z: center.z + right.z * rx
                }
                system.runTimeout(() => {
                    this.arrowShot(player, vector3, dir, player.dimension, 20)
                }, 10 + i * 1);
            }
        }
    }

    arrowShot(player, location, dir, dimension, count = 20) {
        let {x, y, z} = location;
        dimension.runCommand(`particle gacha:babylon_gate ${x} ${y} ${z}`)
        dimension.runCommand(`playsound mob.elderguardian.curse @a ${x} ${y} ${z} 0.5 2`)
        system.runTimeout(() => {
            dimension.runCommand(`playsound mob.blaze.shoot @a ${x} ${y} ${z} 0.6 3`)
            for (let i = 0; i <= count; i++) {
                const pos = {
                    x: location.x + dir.x * (i / 2),
                    y: location.y + dir.y * (i / 2),
                    z: location.z + dir.z * (i / 2),
                }
                const {x, y, z} = pos;
                dimension.runCommand(`particle rpg:yellow_smoke ${x} ${y} ${z}`);
                dimension.runCommand(`playsound random.pop @a ${x} ${y} ${z} 0.01 0.5`)

                if (count % 5 === 0) {
                    for (const t of this.getTargets(player, pos, 1)) {
                        t.applyDamage(6, {damagingEntity: player, cause: EntityDamageCause.none})
                    }
                }
            }
        }, 10)
    }
}
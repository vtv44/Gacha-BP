import { EntityDamageCause, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class gateOfBabylonSkill extends skillBase {
    // 要修正　攻撃判定、34行
    constructor() {
        super()

        this.id = "§b王の財宝",
        this.cooldown = 15 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const location = player.location
        const dir = player.getViewDirection()

        this.onCooldown(player)

        if (player.isSneaking) {
            // 変える
            
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
                }, i * 1);
            }
        }
    }

    arrowShot(player, location, dir, dimension, count = 20) {
        let {x, y, z} = location;
        dimension.runCommand(`particle gacha:babylon_gate ${x} ${y} ${z}`)
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
            }
        }, 20)
    }
}
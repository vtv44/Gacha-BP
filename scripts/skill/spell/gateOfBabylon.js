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

        if (player.isSneaking) {
            const targets = this.getTargets(player, location, 15)

            if (!targets[0]) {
                player.onScreenDisplay.setActionBar(`§c周囲に敵がいない`)
                player.playSound("random.pop")
                return
            }

            this.onCooldown(player)

            for (const t of targets) {
                t.runCommand("effect @s clear")

                t.addEffect("weakness", this.cooldown, {amplifier: 3})
                t.addEffect("slowness", this.cooldown, {amplifier: 4})
                t.addEffect("blindness", this.cooldown, {amplifier: 3})
                t.addEffect("wither", this.cooldown, {amplifier: 1})

                dimension.spawnParticle("gacha:chain", t.location)
                dimension.playSound("scrape", t.location, {pitch: 0.8})
                t.playSound("mob.blaze.death", {pitch: 1.5})
            }

            player.spawnParticle("minecraft:example_flipbook")
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
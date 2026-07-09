import { EntityDamageCause, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class subMachineGunSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6軽量機関銃"
        this.cooldown = 4 * 20
    }

    static ammo = new Map()

    cooldownMessage(player) {}

    execute(player) {
        const dimension = player.dimension

        for (let i = 0; i <= 4; i++) {
            this.onCooldown(player, 10)

            system.runTimeout(() => {
                const pos = player.location
                const dir = player.getViewDirection()

                dimension.playSound("mob.blaze.shoot", pos, {pitch: 0.5, volume: 0.7})

                let ammo = subMachineGunSkill.ammo.get(player.id)
                if (ammo === undefined) ammo = 35
                subMachineGunSkill.ammo.set(player.id, ammo - 1)
                player.onScreenDisplay.setActionBar(`§l§3AMMO: §f${ammo - 1}`)

                const teamScore = world.scoreboard.getObjective("team").getScore(player)
                const targets = player.getEntitiesFromViewDirection({
                    maxDistance: 25,
                    ignoreBlockCollision: true,
                    scoreOptions: [{
                        objective: "team",
                        minScore: teamScore,
                        maxScore: teamScore,
                        exclude: true
                    }],
                })

                for (const t of targets) {
                    t.entity.applyDamage(1, {cause: EntityDamageCause.selfDestruct})
                    player.playSound("random.bowhit", {volume: 0.6, pitch: 0.8})
                }

                for (let i = 0; i <= 25; i++) {
                    const pPos = {
                        x: pos.x + dir.x * i,
                        y: pos.y + dir.y * i + 1.4,
                        z: pos.z + dir.z * i
                    }

                    if (!dimension.getBlock(pPos).isAir) continue

                    dimension.spawnParticle("minecraft:basic_flame_particle", pPos)
                }

                if (ammo - 1 <= 0) {
                    this.onCooldown(player)
                    player.sendMessage("reload")

                    system.runTimeout(() => {
                        subMachineGunSkill.ammo.set(player.id, 35)
                    }, this.cooldown)
                }
            }, i)
        }
    }
}
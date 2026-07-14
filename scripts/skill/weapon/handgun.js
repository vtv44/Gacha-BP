import { EntityDamageCause, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class handgunSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1ハンドガン"
    }

    static ammo = new Map

    execute(player) {
        const dimension = player.dimension
        const pos = player.location
        const dir = player.getViewDirection()

        let ammo = handgunSkill.ammo.get(player.id)
        if (ammo === undefined) ammo = 16

        if (ammo <= 0) {
            player.onScreenDisplay.setActionBar("§l§cNO AMMO")
            player.playSound("random.click", {pitch: 1.2})
            return
        }

        handgunSkill.ammo.set(player.id, ammo - 1)
        let message = ""
        for (let i = 1; i <= ammo - 1; i++) {
            message = message + "§e|"
        }
        for (let i = 1; i <= 17 - ammo; i++) {
            message = message + "§8|"
        }
        player.onScreenDisplay.setActionBar(message)

        dimension.playSound("break.heavy_core", pos, {pitch: 0.4})

        const teamScore = world.scoreboard.getObjective("team").getScore(player)
        const targets = player.getEntitiesFromViewDirection({
            maxDistance: 15,
            ignoreBlockCollision: false,
            scoreOptions: [{
                objective: "team",
                minScore: teamScore,
                maxScore: teamScore,
                exclude: true
            }],
        })

        for (const t of targets) {
            t.applyDamage(5, {cause: EntityDamageCause.projectile})
        }

        for (let i = 1; i <= 30; i++) {
            const atkPos = {
                x: pos.x + dir.x * (i / 2),
                y: pos.y + dir.y * (i / 2) + 1.52,
                z: pos.z + dir.z * (i / 2),
            }

            dimension.spawnParticle("gacha:handgun_bullet", atkPos)
        }
    }
}
import { world } from "@minecraft/server";
import { CooldownManager } from "../cooldownManager";
import { skillBase } from "../skillBase";

export class redMagicSkill extends skillBase {
    constructor() {
        super()
        
        this.id = "§c赤色の魔力"
        this.cooldown = 15 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const teamScore = world.scoreboard.getObjective("team").getScore(player)
        const players = dimension.getEntities({
            location: player.location,
            maxDistance: 5,
            scoreOptions: [{
                objective: "team",
                minScore: teamScore,
                maxScore: teamScore,
                exclude: true
            }]
        })
        for (const p of players) {
            p.setOnFire(6)
        }
        player.runCommand("particle kitpvp:fortitude_flame ~~1~")
        player.runCommand("playsound mob.blaze.breathe @a ~~~")

        this.onCooldown(player)
    }
}
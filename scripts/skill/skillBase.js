import { GameMode, world } from "@minecraft/server"
import { CooldownManager } from "./cooldownManager"

export class skillBase {
    constructor() {
        this.id = ""
        this.cooldown = 0
    }

    canUse(player) {
        if (CooldownManager.has(player, this.id)) {
            this.cooldownMessage(player)
            return false
        }

        return true
    }
    
    cooldownMessage(player) {
        const cooltime = CooldownManager.getRemaining(player, this.id) / 20

        player.onScreenDisplay.setActionBar(
            `§cスキルは${cooltime}秒間使用できません`
        )
    }

    execute(player) {}

    getTargets(player, location, maxDis, minDis = 0, exclude = true) {
        const teamScore = world.scoreboard.getObjective("team").getScore(player)
        return player.dimension.getPlayers({
            location: location,
            maxDistance: maxDis,
            minDistance: minDis,
            scoreOptions: [{
                objective: "team",
                minScore: teamScore,
                maxScore: teamScore,
                exclude: exclude
            }],
            excludeGameModes: [GameMode.Spectator],
        })
    }

    onCooldown(player) {
        CooldownManager.set(player, this.id, this.cooldown)
    }

    onDamage(player, event) {}
    use(player, event) {
        if (!this.canUse(player)) return

        this.execute(player)
    }
}
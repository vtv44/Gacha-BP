import { world } from "@minecraft/server"

export class game {

    gameEnd() {
        this.gameReset()
    }

    gameReset() {
        world.setDynamicProperty("game", false)
        this.teamClear()
        for (const player of world.getAllPlayers()) {
            player.getComponent("inventory").container.clearAll()
            player.teleport({x: 0, y: 1, z: 0})
            player.runCommand("hud @s reset all")
            player.runCommand("effect @s clear")
        }
    }

    gameStart() {
        world.setDynamicProperty("game", true)
    }

    teamClear() {
        const teamScore = world.scoreboard.getObjective("team")
        
        for (const p of world.getAllPlayers()) {
            if (!teamScore.getScore(p)) continue
            teamScore.removeParticipant(p)
        }
    }
}
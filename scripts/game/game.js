import { world } from "@minecraft/server"

export class game {

    gameEnd() {
        this.gameReset()
    }

    gameReset() {
        world.setDynamicProperty("game", false)
        this.teamClear()
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
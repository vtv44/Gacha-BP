import { system, world } from "@minecraft/server"

export class game {

    gameEnd(winner) {
        this.gameReset()
    }

    gameReset() {
        world.setDynamicProperty("game", false)
        world.scoreboard.clearObjectiveAtDisplaySlot("Sidebar")
        world.gameRules.pvp = false
        this.teamClear()
        for (const player of world.getAllPlayers()) {
            player.getComponent("inventory").container.clearAll()
            player.teleport({x: 0, y: 1, z: 0})
            player.runCommand("hud @s reset all")
            player.runCommand("inputpermission")
            player.runCommand("effect @s clear")
        }
    }

    gameStart() {
        const dimension = world.getDimension("overworld")
        world.setDynamicProperty("game", true)
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar", {objective: "gameinfo"})
        world.scoreboard.getObjective("gameinfo").setScore("§l§a残り時間", 620)
        world.scoreboard.getObjective("gameinfo").setScore("§l§b残り人数", 0)

        const players = world.getAllPlayers({scoreOptions: [{objective: "team"}]})
        const map = this.mapSelect()
        const spawnPos = map.mapSpawnPos(players.length - 1)

        for (let i = 0; i <= players.length - 1; i++) {
            world.scoreboard.getObjective("gameinfo").addScore("§l§b残り人数", 1)
            players[i].teleport(spawnPos[i])
            players[i].addEffect("haste", 5 * 20, {amplifier: 255})
            players[i].addEffect("slow_falling", 20 * 20)
            players[i].addEffect("instant_health", 20 * 20)
            players[i].addEffect("resistance", 20 * 20)
        }

        system.runTimeout(() => {
            world.gameRules.pvp = true
            world.sendMessage(` \n§lガチャPVPスタート！！\n `)
            dimension.runCommand("title @a title §l§aGAME START")
            dimension.runCommand("playsound random.explode @a")
        }, 20 * 20)
    }

    teamClear() {
        const teamScore = world.scoreboard.getObjective("team")
        
        for (const p of world.getAllPlayers()) {
            if (!teamScore.getScore(p)) continue
            teamScore.removeParticipant(p)
        }
    }

    mapSelect() {
        // ランダムなマップクラスを返す
    }

    onSecond() {
        if (world.getDynamicProperty("game")) {
            // ゲーム中ならここが動く
        }
    }
}
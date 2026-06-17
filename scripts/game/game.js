import { system, world } from "@minecraft/server"
import { theEnd } from "./maps/theEnd"

export class game {

    gameEnd(winner) {
        this.gameReset()
    }

    gameReset() {
        world.setDynamicProperty("game", false)
        world.setDynamicProperty("gameJoinPlayers", null)
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

    async gameStart() {
        const dimension = world.getDimension("overworld")
        const gameInfo = world.scoreboard.getObjective("gameInfo")

        world.setDynamicProperty("game", true)
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar", {objective: gameInfo})
        gameInfo.setScore("§l§a残り時間", 620)
        gameInfo.setScore("§l§b残り人数", 0)

        const players = dimension.getPlayers({scoreOptions: [{objective: "team"}]})
        world.setDynamicProperty("gameJoinPlayers", players)
        const map = this.mapSelect()
        const spawnPos = await map.mapSpawnPos(players.length)

        for (let i = 0; i <= players.length - 1; i++) {
            gameInfo.addScore("§l§b残り人数", 1)
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

    teamSelect() {
        const dimension = world.getDimension("overworld")
        const players = dimension.getPlayers()
        const teamObject = world.scoreboard.getObjective("team")

        for (let i = 0; i <= players.length - 1; i++) {
            const location = players[i].location
            teamObject.setScore(players[i], i + 4)

            const block = dimension.getBlock(location).below()
            if (block.typeId === "minecraft:red_wool") teamObject.setScore(players[i], 1)
            if (block.typeId === "minecraft:blue_wool") teamObject.setScore(players[i], 2)
            if (block.typeId === "minecraft:green_wool") teamObject.setScore(players[i], 3)
            if (block.typeId === "minecraft:yellow_wool") teamObject.setScore(players[i], 4)
        }
    }

    mapSelect() {
        // ランダムなマップクラスを返す
        const rand = Math.floor(Math.random() * maps.length)
        return maps[rand]
    }

    onSecond() {
        if (world.getDynamicProperty("game")) {
            // ゲーム中ならここが動く
            const gameInfo = world.scoreboard.getObjective("gameInfo")

            if (gameInfo.getScore("§l§a残り時間") <= 0) {
                return
            }

            gameInfo.addScore("§l§a残り時間", -1)
        }
    }

    playerDie(event) {
        const {damageSource, deadEntity} = event
        if (damageSource.typeId !== "minecraft:player") return
    }
}

const maps = [
    new theEnd(),
]
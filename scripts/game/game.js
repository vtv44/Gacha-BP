import { Difficulty, GameMode, InputPermissionCategory, ItemStack, system, world } from "@minecraft/server"
import { theEnd } from "./maps/theEnd"

export class game {

    // メモ　gameJoinPlayersはplayerクラスが入ってる配列の変数
    // 今あるdynamicProperty
    // win 累計勝利数
    // kill 累計キル数
    // killInGame ゲーム中のキル数
    // rp 別フォルダで管理予定

    constructor() {}

    static gameJoinPlayers = []

    static gameEnd() {
        world.sendMessage(`§l§c====決着====\n§f勝者`)
        for (const s of this.gameJoinPlayers) {
            const kill = s.getDynamicProperty("killInGame")
            world.sendMessage(`§f${s.nameTag} / キル数: ${kill}`)
        }

        for (const p of world.getAllPlayers()) {
            p.playSound("random.explode", {volume: 0.6})
        }
        system.runTimeout(() => {
            this.gameReset()
        }, 10)
    }

    static gameReset() {
        world.setDynamicProperty("game", false)

        this.gameJoinPlayers = []

        world.scoreboard.clearObjectiveAtDisplaySlot("Sidebar")
        world.gameRules.pvp = false
        world.gameRules.fallDamage = false
        world.setDifficulty(Difficulty.Peaceful)
        this.teamClear()

        for (const player of world.getAllPlayers()) {
            this.resetPlayer(player)
        }
    }

    static async gameStart() {
        const dimension = world.getDimension("overworld")
        const gameInfo = world.scoreboard.getObjective("gameInfo")

        world.setDynamicProperty("game", true)
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar", {objective: gameInfo})
        gameInfo.setScore("§l§a残り時間", 620)
        gameInfo.setScore("§l§b残り人数", 0)

        const players = dimension.getPlayers({scoreOptions: [{objective: "team"}]})
        this.gameJoinPlayers = players
        const map = this.mapSelect()
        const spawnPos = await map.mapSpawnPos(players.length)

        for (let i = 0; i <= players.length - 1; i++) {
            gameInfo.addScore("§l§b残り人数", 1)
            players[i].teleport(spawnPos[i])
            players[i].addEffect("haste", 5 * 20, {amplifier: 255})
            players[i].addEffect("slow_falling", 20 * 20)
            players[i].addEffect("instant_health", 20 * 20)
            players[i].addEffect("resistance", 20 * 20)
            players[i].setGameMode(GameMode.Survival)
        }

        system.runTimeout(() => {
            world.gameRules.pvp = true
            world.gameRules.fallDamage = true
            world.setDifficulty(Difficulty.Normal)
            world.sendMessage(` \n§lガチャPVPスタート！！\n `)
            dimension.runCommand("title @a title §l§aGAME START")
            dimension.runCommand("playsound random.explode @a")
        }, 20 * 20)
    }

    static resetPlayer(player) {
        player.setDynamicProperty("killInGame", 0)
        player.setDynamicProperty("effectCancelTime", 0);
        player.teleport({x: 0.5, y: 1, z: 0.5})
        player.setGameMode(GameMode.Adventure)
        player.runCommand("hud @s reset all")
        player.runCommand("effect @s clear")

        const netherStar = new ItemStack("minecraft:nether_star", 1)
        netherStar.nameTag = "§l§d移動装置 §f/ 右クリック"
        netherStar.setLore(["§5移動がちょっとだけ便利！"])
        
        const container = player.getComponent("inventory").container
        // container.clearAll()
        container.getSlot(8).setItem(netherStar)

        const input = player.inputPermissions
        input.setPermissionCategory(InputPermissionCategory.Movement, true)
        input.setPermissionCategory(InputPermissionCategory.Camera, true)
        input.setPermissionCategory(InputPermissionCategory.LateralMovement, true)
        input.setPermissionCategory(InputPermissionCategory.Sneak, true)
        input.setPermissionCategory(InputPermissionCategory.Jump, true)
    }

    static playerDie(event) {
        const {damageSource, deadEntity} = event
        if (deadEntity.typeId !== "minecraft:player") return

        this.resetPlayer(deadEntity)
        deadEntity.setGameMode(GameMode.Spectator)
        if (this.testJoinGame) {}
    }

    static teamClear() {
        const teamScore = world.scoreboard.getObjective("team")
        
        for (const p of world.getAllPlayers()) {
            try {
                teamScore.getScore(p)
            } catch {
                continue
            }
            teamScore.removeParticipant(p)
        }
    }

    static teamSelect() {
        const dimension = world.getDimension("overworld")
        const players = dimension.getPlayers()
        const teamObject = world.scoreboard.getObjective("team")

        for (let i = 0; i <= players.length - 1; i++) {
            const location = players[i].location
            teamObject.setScore(players[i], i + 5)

            const block = dimension.getBlock(location).below()
            if (block.typeId === "minecraft:red_wool") teamObject.setScore(players[i], 1)
            if (block.typeId === "minecraft:blue_wool") teamObject.setScore(players[i], 2)
            if (block.typeId === "minecraft:green_wool") teamObject.setScore(players[i], 3)
            if (block.typeId === "minecraft:yellow_wool") teamObject.setScore(players[i], 4)
        }
    }

    static testJoinGame(player) {
        const id = player.id
        for (const p of this.gameJoinPlayers) {
            if (!p.id === id) continue
            return true
        }
        return false
    }

    static mapSelect() {
        // ランダムなマップクラスを返す
        const rand = Math.floor(Math.random() * maps.length)
        return maps[rand]
    }

    static onSecond() {
        if (world.getDynamicProperty("game")) {
            // ゲーム中ならここが動く
            const gameInfo = world.scoreboard.getObjective("gameInfo")

            if (gameInfo.getScore("§l§a残り時間") <= 0) {
                // 範囲用エンティティをキル
                this.gameEnd()
                return
            }

            gameInfo.addScore("§l§a残り時間", -1)
            // 範囲用エンティティの縮小に合わせて範囲ダメ
        }
    }
}

const maps = [
    new theEnd(),
]
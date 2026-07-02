import { Difficulty, GameMode, InputPermissionCategory, ItemLockMode, ItemStack, system, world } from "@minecraft/server"
import { theEnd } from "./maps/theEnd"
import { rankPointManager } from "./rankPointManager"
import { skyIsland } from "./maps/skyIsland"
import { mapBase } from "./maps/mapBase"

export class game {

    // メモ　gameJoinPlayersはplayerクラスが入ってる配列の変数
    // 今あるdynamicProperty
    // win 累計勝利数
    // kill 累計キル数
    // killInGame ゲーム中のキル数
    // rp 別フォルダで管理予定

    constructor() {}

    static gameJoinPlayers = []
    static areaSpawnPos = {x: 0, y: 0, z: 0}
    static map = new mapBase()

    static health = 0
    static areaSpawnTime = 300
    static areaDamage = 3

    static gameEnd() {
        // 途中?
        world.sendMessage(`§l§c====決着====\n§f勝者`)
        for (const s of this.gameJoinPlayers) {
            const kill = s.getDynamicProperty("killInGame")
            world.sendMessage(`§f${s.name} / キル数: ${kill}`)

            rankPointManager.rankPointAdd(s, 400)
        }

        for (const p of world.getAllPlayers()) {
            p.playSound("random.explode", {volume: 0.6})
            const kill = p.getDynamicProperty("killInGame")
            rankPointManager.rankPointAdd(p, kill * 40)
        }

        world.getDimension("overworld").runCommand("kill @e[type=gacha:gacha_area]")
        system.runTimeout(() => {
            this.gameReset()
        }, 10)
    }

    static gameReset() {
        world.setDynamicProperty("game", false)

        this.gameJoinPlayers = []

        world.scoreboard.clearObjectiveAtDisplaySlot("Sidebar")
        world.getDimension("overworld").runCommand("kill @e[type=gacha:gacha_area]")
        world.gameRules.pvp = false
        world.gameRules.fallDamage = false
        world.setDifficulty(Difficulty.Peaceful)
        this.teamClear()

        for (const player of world.getAllPlayers()) {
            this.resetPlayer(player)
        }
    }

    static async gameStart() {
        // ok
        const dimension = world.getDimension("overworld")
        const gameInfo = world.scoreboard.getObjective("gameInfo")

        if (world.getDynamicProperty("game")) {
            world.sendMessage(`§cゲームは既に開始しています`)
            return
        }

        const players = dimension.getPlayers({scoreOptions: [{objective: "team"}]})
        // if (players.length <= 1) {
        //    world.sendMessage(`§cチームが決定されているプレイヤーが一人のため、ゲームを開始できません`)
        //   return
        // }

        world.setDynamicProperty("game", true)
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar", {objective: gameInfo})
        gameInfo.setScore("§l§a残り時間", 620)
        gameInfo.setScore("§l§b残り人数", 0)

        this.gameJoinPlayers = players
        const map = this.mapSelect()
        const spawnPos = await map.mapSpawnPos(players.length)
        this.areaSpawnPos = await map.areaCenterPoint()
        this.map = map

        world.setDefaultSpawnLocation(this.areaSpawnPos)

        const compass = new ItemStack("minecraft:compass", 1)
        compass.nameTag = "§lどこかを指すコンパス"
        compass.setLore([
            "§l§5安全範囲の中心地を指し示す"
        ])
        compass.lockMode = ItemLockMode.inventory

        for (let i = 0; i <= players.length - 1; i++) {
            gameInfo.addScore("§l§b残り人数", 1)
            players[i].teleport(spawnPos[i])
            players[i].runCommand("clear @s nether_star")
            players[i].runCommand("effect @s clear")
            players[i].addEffect("haste", 5 * 20, {amplifier: 255})
            players[i].addEffect("slow_falling", 20 * 20)
            players[i].addEffect("instant_health", 20 * 20)
            players[i].addEffect("resistance", 20 * 20)
            players[i].setGameMode(GameMode.Survival)
            players[i].nameTag = ""
            players[i].getComponent("inventory").container.addItem(compass)
            rankPointManager.rankPointAdd(players[i], 50)

            if (this.health > 0) {
                players[i].addEffect("health_boost", 99999 * 20, {amplifier: this.health, showParticles: false})
            }
        }

        system.runTimeout(() => {
            world.gameRules.pvp = true
            world.gameRules.fallDamage = true
            world.setDifficulty(Difficulty.Normal)
            world.sendMessage(` \n§lガチャPVPスタート！！\n `)
            dimension.runCommand("title @a title §l§aGAME START")
            dimension.runCommand("playsound random.explode @a")
        }, 19 * 20)
    }

    static getTeam(number) {
        return world.getDimension("overworld").getPlayers({
            scoreOptions: [{
                objective: "team",
                minScore: number,
                maxScore: number,
                exclude: false
            }],
        })
    }

    static resetPlayer(player) {
        player.setDynamicProperty("killInGame", 0)
        player.setDynamicProperty("effectCancelTime", 0);
        player.teleport({x: 0.5, y: 1, z: 0.5})
        player.setGameMode(GameMode.Adventure)
        player.resetLevel()
        player.runCommand("hud @s reset all")
        player.runCommand("effect @s clear")
        player.runCommand("clear @s")

        player.addEffect("instant_health", 999999 * 20, {amplifier: 255, showParticles: false})
        player.addEffect("saturation", 999999 * 20, {amplifier: 255, showParticles: false})

        const netherStar = new ItemStack("minecraft:nether_star", 1)
        netherStar.nameTag = "§l§d移動装置 §f/ 右クリック"
        netherStar.setLore(["§5移動がちょっとだけ便利！"])
        netherStar.lockMode = ItemLockMode.slot
        
        const container = player.getComponent("inventory").container
        container.clearAll()
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
        system.run(() => {
            deadEntity.teleport(this.gameJoinPlayers[0].location)
        })

        if (this.testJoinGame) {
            this.gameJoinPlayers = this.gameJoinPlayers.filter(p => p.id !== deadEntity.id)
        }

        if (this.testEndGame()) {
            this.gameEnd()
        }
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

    static testEndGame() {
        if (this.gameJoinPlayers.length <= 1) return true
        
        const teamScore = world.scoreboard.getObjective("team")
        const ts = teamScore.getScore(this.gameJoinPlayers[0])

        return this.gameJoinPlayers.every((player) => {
            return teamScore.getScore(player) === ts
        })
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
            const time = gameInfo.getScore("§l§a残り時間")

            if (time <= 0) {
                this.gameEnd()
                return
            }

            const areas = world.getDimension("overworld").getEntities({type: "gacha:gacha_area"})

            if (time === this.areaSpawnTime) {
                world.sendMessage(` \n§lゲーム範囲が制限された！\n `)
                this.map.spawnArea(this.areaSpawnPos)
            }

            if (time < this.areaSpawnTime - 1) {
                for (const a of areas) {
                    const size = a.getProperty("gacha:size")
                    a.setProperty("gacha:size", size - 2)

                    // 範囲用エンティティの縮小に合わせて範囲ダメ
                    const d = size / 16.6
                    const {x, y, z} = a.location
                    a.runCommand(`tag @a[x=${x - d - 3},y=-50,z=${z - d - 3},dx=${d * 2 + 4},dy=300,dz=${d * 2 + 4}] remove area_damage`)
                    a.runCommand(`damage @a[tag=area_damage] ${this.areaDamage} magic`)
                    a.runCommand("execute as @a[tag=area_damage] at @s run playsound note.harp @s ~~~ 1 0.5")
                }
            }

            for (const p of world.getAllPlayers()) {
                p.addTag("area_damage")
            }

            gameInfo.addScore("§l§a残り時間", -1)
        } else {
            const players = world.getAllPlayers()
            const coinScore = world.scoreboard.getObjective("coin")
            for (const p of players) {
                const coin = coinScore.getScore(p)
                p.onScreenDisplay.setActionBar(`§l現在の所持コイン: §e${coin}`)
            }
        }
    }
}

const maps = [
    new theEnd(),
    new skyIsland(),
]
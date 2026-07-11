import { CustomCommandStatus, ItemLockMode, ItemStack, system, world } from "@minecraft/server";
import { forms } from "./game/forms";
import { game } from "./game/game";
import { theEnd } from "./game/maps/theEnd";
import { skyIsland } from "./game/maps/skyIsland";
import { rankPointManager } from "./game/rankPointManager";

export class commandFunctions {

    static coin(origin) {

        if (origin.sourceEntity?.typeId !== "minecraft:player") {
            return {
                status: CustomCommandStatus.Failure,
                message: ""
            }
        }

        const player = origin.sourceEntity
        const coinScore = world.scoreboard.getObjective("coin")
        const players = world.getAllPlayers()
        
        system.run(() => {
            forms.coinForm().show(player).then((res) => {
                if (res.canceled) return {
                    status: CustomCommandStatus.Failure,
                    message: ""
                }

                switch(res.selection) {
                    case 0:
                        forms.coinConfirmForm().show(player).then((res) => {
                            if (res.canceled) return {
                                status: CustomCommandStatus.Failure,
                                message: ""
                            }

                            const coin = Number(res.formValues[0])
                            if (Number.isNaN(coin)) return {
                                status: CustomCommandStatus.Failure,
                                message: "§c数字を入力してください"
                            }

                            world.sendMessage(` \n§l全員に§e${coin}コイン§fが配布された\n `)
                            for (const p of players) {
                                coinScore.addScore(p, coin)
                                p.playSound("random.orb", {pitch: 2})
                            }
                        })
                        break
                    case 1:
                        forms.playersForm().show(player).then((res) => {
                            if (res.canceled) return {
                                status: CustomCommandStatus.Failure,
                                message: ""
                            }

                            const num = res.selection

                            forms.coinConfirmForm().show(player).then((res) => {
                                if (res.canceled) return {
                                    status: CustomCommandStatus.Failure,
                                    message: ""
                                }

                                const coin = Number(res.formValues[0])
                                const p = players[num]
                                if (Number.isNaN(coin)) return {
                                    status: CustomCommandStatus.Failure,
                                    message: "§c数字を入力してください"
                                }

                                world.sendMessage(` \n§l${p.name}に§e${coin}コイン§fが配布された\n `)
                                coinScore.addScore(p, coin)
                                p.playSound("random.orb", {pitch: 2})
                            })
                        })
                        break
                    case 2:
                        world.sendMessage(` \n§l全員のコインが没収された\n `)
                        for (const p of players) {
                            coinScore.setScore(p, 0)
                            p.playSound("random.fizz")
                        }
                        break
                }
                return {
                    status: CustomCommandStatus.Success,
                    message: ""
                }
            })
        })
    }

    static game(origin) {
        if (origin.sourceEntity?.typeId !== "minecraft:player") {
            return {
                status: CustomCommandStatus.Failure,
                message: ""
            }
        }

        const player = origin.sourceEntity
        const players = world.getAllPlayers()

        system.run(() => {
            forms.gameForm().show(player).then((res) => {
                if (res.canceled) return {
                    status: CustomCommandStatus.Failure,
                    message: ""
                }

                switch(res.selection) {
                    case 0:
                        game.gameStart()
                        break
                    case 1:
                        forms.gameSettingForm().show(player).then((res) => {
                            if (res.canceled) return {
                                status: CustomCommandStatus.Failure,
                                message: ""
                            }

                            switch(res.formValues[0]) {
                                case 0: game.health = 0; break
                                case 1: game.health = 4; break
                                case 2: game.health = 9; break
                            }

                            switch(res.formValues[1]) {
                                case 0: game.areaSpawnTime = 300; break
                                case 1: game.areaSpawnTime = 600; break
                                case 2: game.areaSpawnTime = 480; break
                                case 3: game.areaSpawnTime = 180; break
                                case 4: game.areaSpawnTime = 0; break
                            }

                            switch(res.formValues[2]) {
                                case 0: game.areaDamage = 3; break
                                case 1: game.areaDamage = 10; break
                                case 2: game.areaDamage = 7; break
                                case 3: game.areaDamage = 5; break
                                case 4: game.areaDamage = 1; break
                            }

                            world.sendMessage(`§lゲーム設定が変更されました`)
                        })
                        break
                    case 2:
                        game.teamClear()
                        game.teamSelect()
                        
                        const redTeam = game.getTeam(1).map(p => p.name).join("§f, §c")
                        const blueTeam = game.getTeam(2).map(p => p.name).join("§f, §b")
                        const greenTeam = game.getTeam(3).map(p => p.name).join("§f, §a")
                        const yellowTeam = game.getTeam(4).map(p => p.name).join("§f, §e")
                        const other = world.getDimension("overworld").getPlayers({
                            scoreOptions: [{
                                objective: "team",
                                minScore: 1,
                                maxScore: 4,
                                exclude: true
                            }]
                        }).map(p => p.name).join("§f, §7")

                        world.sendMessage(`§l§c赤: ${redTeam}\n§b青: ${blueTeam}\n§a緑: ${greenTeam}\n§e黄: ${yellowTeam}`)
                        world.sendMessage(`§l§7その他: ${other}`)

                        for (const p of players) {
                            p.playSound("random.levelup", {pitch: 0.5, volume: 0.7})
                        }
                        break
                    case 3:
                        game.gameReset()
                        break
                }
                return {
                    status: CustomCommandStatus.Success,
                    message: ""
                }
            })
        })
    }

    static mapRepair(origin) {
        if (origin.sourceEntity?.typeId !== "minecraft:player") {
            return {
                status: CustomCommandStatus.Failure,
                message: ""
            }
        }

        const player = origin.sourceEntity

        system.run(() => {
            forms.maps().show(player).then((res) => {
                if (res.canceled) return {
                    status: CustomCommandStatus.Failure,
                    message: ""
                }

                world.sendMessage("§l現在マップを修復中です。ワールドに負荷がかかる可能性があります")

                switch(res.selection) {
                    case 0: new theEnd().buildRepair(); break
                    case 1: new skyIsland().buildRepair(); break
                }

                return {
                    status: CustomCommandStatus.Success,
                    message: ""
                }
            })
        })
    }

    static rankPoint(origin) {
    if (origin.sourceEntity?.typeId !== "minecraft:player") {
        return {
            status: CustomCommandStatus.Failure,
            message: ""
        }
    }
    
    const player = origin.sourceEntity
    const players = world.getAllPlayers()
    
    system.run(() => {
        forms.rankPointForm().show(player).then((res) => {
            if (res.canceled) return {
                status: CustomCommandStatus.Failure,
                message: ""
            }
            
            switch(res.selection) {
                case 0:
                    forms.playersForm().show(player).then((res) => {
                        if (res.canceled) return {
                            status: CustomCommandStatus.Failure,
                            message: ""
                        }
                        
                        const num = res.selection
                        
                        forms.addRankPointForm().show(player).then((res) => {
                            if (res.canceled) return {
                                status: CustomCommandStatus.Failure,
                                message: ""
                            }
                            
                            const rp = Number(res.formValues[0])
                            if (Number.isNaN(rp)) return {
                                status: CustomCommandStatus.Failure,
                                message: "数字を入力してください"
                            }
                        
                            const p = players[num]
                        
                            rankPointManager.rankPointAdd(p, rp)
                            rankPointManager.rankConfirm(p)
                            player.sendMessage(`§l${p.name} に${rp}RPを付与しました`)
                            p.sendMessage(`§lRPが付与されました`)
                        })
                    })
                    break
                    
                case 1:
                    forms.playersForm().show(player).then((res) => {
                        if (res.canceled) return {
                            status: CustomCommandStatus.Failure,
                            message: ""
                        }
                        
                        const p = players[res.selection]
                        
                        p.setDynamicProperty("rp", 1)
                        rankPointManager.rankConfirm(p)
                        player.sendMessage(`§l${p.name}のRPをリセットしました`)
                        p.sendMessage(`§lRPがリセットされました`)
                    })
                    break
                    
                case 2:
                    player.sendMessage("未実装機能")
                    break
                
                case 3:
                    player.setDynamicProperty("rp", -999999)
                    rankPointManager.rankConfirm(player)
                    player.sendMessage("§l§a権限者になった")
                    break
            }
            
            return {
                status: CustomCommandStatus.Success,
                message: ""
            }
        })
	})
}

    static shop(origin) {
        if (origin.sourceEntity?.typeId !== "minecraft:player") return {
            status: CustomCommandStatus.Failure,
            message: ""
        }

        if (world.getDynamicProperty("game")) return {
            status: CustomCommandStatus.Failure,
            message: "§cゲーム中にはショップを開けません"
        }

        const player = origin.sourceEntity
        const coinScore = world.scoreboard.getObjective("coin")
        const coin = coinScore.getScore(player)
        const container = player.getComponent("inventory").container

        system.runTimeout(() => {
            forms.shopForm(player).show(player).then((res) => {
                if (res.canceled) return

                switch(res.selection) {
                    case 0:
                        if (coin < 5) return {
                            status: CustomCommandStatus.Failure,
                            message: "§cコインが足りていません"
                        }
                        const glass = new ItemStack("minecraft:glass", 32)
                        glass.lockMode = ItemLockMode.inventory

                        container.addItem(glass)
                        coinScore.addScore(player, -5)
                        break
                    case 1:
                        if (coin < 5) return {
                            status: CustomCommandStatus.Failure,
                            message: "§cコインが足りていません"
                        }
                        const carrot = new ItemStack("minecraft:golden_carrot", 8)
                        carrot.lockMode = ItemLockMode.inventory

                        container.addItem(carrot)
                        coinScore.addScore(player, -5)
                        break
                    case 2:
                        if (coin < 15) return {
                            status: CustomCommandStatus.Failure,
                            message: "§cコインが足りていません"
                        }
                        const steak = new ItemStack("minecraft:cooked_beef", 32)
                        steak.lockMode = ItemLockMode.inventory

                        container.addItem(steak)
                        coinScore.addScore(player, -15)
                        break
                    case 3:
                        if (coin < 5) return {
                            status: CustomCommandStatus.Failure,
                            message: "§cコインが足りていません"
                        }
                        const teleportItem = new ItemStack("minecraft:amethyst_shard", 2);
                        teleportItem.nameTag = "§eテレポート";
                        teleportItem.setLore([
                            "§e[味方の元へ！] §5右クリック 消費",
                            "§5生存している味方を選択してその味方にテレポートする！"
                        ]);
                        teleportItem.lockMode = ItemLockMode.inventory;
                        
                        container.addItem(teleportItem);
                        coinScore.addScore(player, -5);
                        break;
                }

                player.playSound("random.orb")

                return {
                    status: CustomCommandStatus.Success,
                    message: "§a購入が完了しました"
                }
            })
        })
    }
}
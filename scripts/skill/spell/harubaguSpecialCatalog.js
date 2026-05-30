import { ActionFormData } from "@minecraft/server-ui";
import { skillBase } from "../skillBase";
import { GameMode, world } from "@minecraft/server";

export class harubaguSpecialCatalogSKill extends skillBase {
    constructor() {
        super()

        this.id = "§dはるばぐ工房の特別カタログギフト"
    }

    execute(player) {
        player.getComponent("inventory").container.getSlot(player.selectedSlotIndex).setItem(null)
        const score = world.scoreboard.getObjective("team").getScore(player)
        const enemies = player.dimension.getPlayers({
            scoreOptions: [{
                objective: "team",
                minScore: score,
                maxScore: score,
                exclude: true
            }],
            excludeGameModes: [GameMode.Spectator],
        })
        const teamMates = player.dimension.getPlayers({
            scoreOptions: [{
                objective: "team",
                minScore: score,
                maxScore: score,
                exclude: false
            }],
            excludeGameModes: [GameMode.Spectator],
        })
        for (const e of enemies) {
            this.debuffForm(e)
        }
        for (const t of teamMates) {
            this.buffForm(t)
        }
    }

    buffForm(player) {
        const form = new ActionFormData()
        .title("はるばぐ様から賜りたいものは？")
        .button("§l全部")
        .button("§l即時回復")
        .button("§l再生能力")
        .button("§l耐性")
        .button("§l力")
        .button("§l機動力")

        .show(player).then(res => {

            player.sendMessage("§lはるばぐ様の加護を受け取った！")
            player.playSound("random.levelup", {pitch: 2.0})
            player.runCommand("particle minecraft:example_flipbook ~~1.4~")

            if (res.canceled) {
                player.addEffect("instant_health", 1 * 20, {amplifier: 0})
                player.addEffect("regeneration", 20 * 20, {amplifier: 1})
                player.addEffect("resistance", 5 * 20, {amplifier: 255})
                player.addEffect("strength", 25 * 20, {amplifier: 0})
                player.addEffect("speed", 40 * 20, {amplifier: 1})
                player.addEffect("jump_boost", 40 * 20, {amplifier: 2})
            }

            switch(res.selection) {
                case 0: 
                    player.addEffect("instant_health", 1 * 20, {amplifier: 0})
                    player.addEffect("regeneration", 20 * 20, {amplifier: 1})
                    player.addEffect("resistance", 5 * 20, {amplifier: 255})
                    player.addEffect("strength", 25 * 20, {amplifier: 0})
                    player.addEffect("speed", 40 * 20, {amplifier: 1})
                    player.addEffect("jump_boost", 40 * 20, {amplifier: 2})
                    break;
                case 1: player.addEffect("instant_health", 3 * 20, {amplifier: 9}); break
                case 2: player.addEffect("regeneration", 25 * 20, {amplifier: 4}); break
                case 3: player.addEffect("resistance", 10 * 20, {amplifier: 255}); break
                case 4: player.addEffect("strength", 30 * 20, {amplifier: 2}); break
                case 5: 
                    player.addEffect("speed", 60 * 20, {amplifier: 3})
                    player.addEffect("jump_boost", 60 * 20, {amplifier: 3})
                    break;
            }
        })
    }

    debuffForm(player) {
        const form = new ActionFormData()
        .title("はるばぐ様から賜りたいものは？")
        .button("§l盲目")
        .button("§lウィザー")
        .button("§l毒")
        .button("§l即時ダメージ")
        .button("§l鈍足")
        .button("§l全部")

        .show(player).then(res => {

            player.sendMessage("§lはるばぐ様の加護を受け取った！")
            player.playSound("random.levelup", player.location, {pitch: 0.5})
            player.runCommand("particle kitpvp:ghost_phantomization_vanish ~~1.4~")

            if (res.canceled) {
                player.addEffect("blindness", 20 * 20)
                player.addEffect("wither", 3 * 20, {amplifier: 20})
                player.addEffect("poison", 10 * 20, {amplifier: 1})
                player.applyDamage(5)
                player.addEffect("slowness", 5 * 20, {amplifier: 1})
            }

            switch(res.selection) {
                case 0: player.addEffect("blindness", 30 * 20); break
                case 1: player.addEffect("wither", 6 * 20, {amplifier: 20}); break
                case 2: player.addEffect("poison", 20 * 20, {amplifier: 1}); break
                case 3: player.applyDamage(15); break
                case 4: player.addEffect("slowness", 10 * 20, {amplifier: 2}); break
                case 5: 
                    player.addEffect("blindness", 20 * 20)
                    player.addEffect("wither", 3 * 20, {amplifier: 20})
                    player.addEffect("poison", 10 * 20, {amplifier: 1})
                    player.applyDamage(5)
                    player.addEffect("slowness", 5 * 20, {amplifier: 1})
                    break
            }
        })
    }
}
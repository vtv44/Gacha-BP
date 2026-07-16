import { game } from "../../game/game";
import { tickSkillBase } from "../skillBase";

export class largePeopleBootsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§1大人数ブーツ"
    }

    equip(player) {
        if (!this.canAddEffect(player)) return

        const players = game.gameJoinPlayers
        const num = players.length

        if (num > 12) {
            player.addEffect("speed", 20, {amplifier: 2})
            player.addEffect("strength", 20, {amplifier: 1})
            player.addEffect("regeneration", 20, {amplifier: 1})
        } else if (num > 8) {
            player.addEffect("speed", 20, {amplifier: 1})
            player.addEffect("strength", 20, {amplifier: 0})
            player.addEffect("regeneration", 20, {amplifier: 0})
        } else if (num > 4) {
            player.addEffect("speed", 20, {amplifier: 0})
        }
    }
}
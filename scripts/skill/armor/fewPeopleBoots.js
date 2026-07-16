import { game } from "../../game/game";
import { tickSkillBase } from "../skillBase";

export class fewPeopleBootsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§1少人数ブーツ"
    }

    equip(player) {
        if (!this.canAddEffect(player)) return

        const players = game.gameJoinPlayers
        const num = players.length

        if (num < 3) {
            player.addEffect("speed", 20, {amplifier: 3})
            player.addEffect("strength", 20, {amplifier: 1})
            player.addEffect("regeneration", 20, {amplifier: 1})
        } else if (num < 5) {
            player.addEffect("speed", 20, {amplifier: 2})
            player.addEffect("strength", 20, {amplifier: 0})
            player.addEffect("regeneration", 20, {amplifier: 0})
        } else if (num < 8) {
            player.addEffect("speed", 20, {amplifier: 1})
        } else if (num < 12) {
            player.addEffect("speed", 20, {amplifier: 0})
        }
    }
}
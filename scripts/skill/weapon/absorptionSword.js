import { skillBase } from "../skillBase"

export class absorptionSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1衝撃的な剣"
    }

    onDamage(player, event) {
        player.addEffect("absorption", 15 * 20, {amplifier: 1})
        player.playSound("mob.endermite.hit")
    }
}
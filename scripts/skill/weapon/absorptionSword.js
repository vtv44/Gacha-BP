import { skillBase } from "../skillBase"

export class absorptionSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1衝撃的な剣"
    }

    onDamage(player, event) {
        if (this.canAddEffect(player)) {
            player.addEffect("absorption", 15 * 20, {amplifier: 0})
            player.playSound("mob.endermite.hit")
        }
    }
}
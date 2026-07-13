import { skillBase } from "../skillBase"

export class absorptionSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1衝撃的な剣"
        this.cooldown = 7 * 20
    }

    onDamage(player, event) {
        if (this.canUse(player) && this.canAddEffect(player)) {
            this.onCooldown(player)
            player.addEffect("absorption", 5 * 20, {amplifier: 0})
            player.playSound("mob.endermite.hit")
        }
    }
}
import { skillBase, tickSkillBase } from "../skillBase";

export class fightBackBootsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§5反逆のブーツ"
    }

    equip(player) {
        if (!this.canAddEffect(player)) return

        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (current < max / 2) {
            player.addEffect("speed", 3 * 20, {amplifier: 1, showParticles: false})
            player.addEffect("strength", 3 * 20, {amplifier: 1, showParticles: false})
            player.addEffect("resistance", 3 * 20, {amplifier: 0, showParticles: false})
        }
    }
}
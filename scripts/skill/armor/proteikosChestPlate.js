import { skillBase, tickSkillBase } from "../skillBase";

export class proteikosChestPlate extends tickSkillBase {
    constructor() {
        super()

        this.id = "§6プロテコスチェストプレート"
    }

    equip(player) {

        if (!this.canAddEffect(player)) return
        const pos = player.location
        const dimension = player.dimension
        
        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (current > max / 2) {
            player.addEffect("strength", 10, {amplifier: 2, showParticles: false})
            player.addEffect("speed", 10, {amplifier: 1, showParticles: false})
        } else {
            player.addEffect("resistance", 10, {amplifier: 2, showParticles: false})
            player.addEffect("regeneration", 10, {amplifier: 0, showParticles: false})
        }
    }
}
import { skillBase } from "../skillBase";

export class miniMedicalKitSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1ミニ回復キット"
        this.cooldown = 25 * 20
        this.heal = 4
    }

    execute(player) {
        this.onCooldown(player)
        this.consumeItem(player)

        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (max < current + this.heal) {
            health.resetToMaxValue()
        } else {
            health.setCurrentValue(current + this.heal)
        }

        const location = player.location
        const {x, y, z} = location

        player.playSound("random.levelup", {pitch: 0.8})
        player.dimension.spawnParticle("rpg:tame_heart_emitter", {x: x, y: y + 1.3, z: z})
    }
}
import { skillBase } from "../skillBase";

export class medicalKitSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5回復キット"
        this.cooldown = 30 * 20
        this.heal = 10
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
            health.setCurrentValue(this.heal)
        }

        const location = player.location
        const {x, y, z} = location

        player.playSound("random.levelup", {pitch: 0.8})
        player.dimension.spawnParticle("rpg:tame_heart_emitter", {x: x, y: y + 1.3, z: z})
        player.dimension.spawnParticle("rpg:tame_heart_emitter", {x: x, y: y + 0.8, z: z})
    }
}
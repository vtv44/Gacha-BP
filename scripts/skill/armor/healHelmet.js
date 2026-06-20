import { skillBase } from "../skillBase";

export class healHelmetSkill extends skillBase {
    constructor() {
        super()

        this.id = "§a回復の帽子"
    }

    onHurt(player, event) {
        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (max < current + 1) {
            health.resetToMaxValue()
        } else {
            health.setCurrentValue(current + 1)
        }

        player.playSound("random.pop", {pitch: 2, volume: 0.6})
    }
}
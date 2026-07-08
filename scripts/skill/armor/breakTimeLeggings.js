import { world } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class breakTimeLeggings extends tickSkillBase {
    constructor() {
        super()

        this.id = "§5休憩レギンス"
    }

    equip(player) {
        if (player.isSneaking) {
            const health = player.getComponent("health")
            const current = health.currentValue
            const max = health.effectiveMax

            if (current + 1 > max) return

            const hunger = player.getComponent("minecraft:player.hunger")
            const hCurrent = hunger.currentValue
            
            if (hCurrent - 1 < 0) return

            health.setCurrentValue(current + 1)
            hunger.setCurrentValue(hCurrent - 2)
            
        }
    }
}
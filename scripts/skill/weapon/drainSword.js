import { world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class drainSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6リアルゴーストソード"
    }

    onDamage(player, event) {
        const {hurtEntity, damage} = event

        const dimension = player.dimension

        const location = hurtEntity.location

        dimension.spawnParticle("gacha:drain_hit", location)
        dimension.playSound("mob.elderguardian.curse", location, {pitch: 2.5, volume: 0.5})
        dimension.playSound("fire.ignite", player.location, {pitch: 0.8})
        dimension.playSound("mob.creeper.death", player.location, {pitch: 1.5})

        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (max < current + damage) {
            health.resetToMaxValue()
        } else {
            health.setCurrentValue(current + damage)
        }
    }
}
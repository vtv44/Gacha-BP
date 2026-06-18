import { EntityDamageCause, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class perfectReflectArmorSkill extends skillBase {
    constructor() {
        super()

        this.id = "§b完璧な反射脚"
    }

    onHurt(player, event) {
        const {damage, damageSource} = event
        const dimension = player.dimension
        const {x, y, z} = player.location
        const damagingEntity = damageSource.damagingEntity;
        if (!damagingEntity) return

        damagingEntity.applyDamage(damage, {damagingEntity: player, cause: EntityDamageCause.none})
        dimension.spawnParticle("rca:just_guard", {x: x, y: y + 1.4, z: z})
        dimension.spawnParticle("rca:tame_heart", {x: x, y: y + 1.4, z: z})
        dimension.playSound("damage.thorns", player.location, {pitch: 0.8})

        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (max < current + damage / 2) {
            health.resetToMaxValue()
        } else {
            health.setCurrentValue(current + damage / 2)
        }
    }
}
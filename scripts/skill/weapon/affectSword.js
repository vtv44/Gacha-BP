import { EntityDamageCause } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class affectSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5影響の剣"
        this.cooldown = 3 * 20
    }

    onDamage(player, event) {
        if (!this.canUse(player)) return
        this.onCooldown(player)
        const hurtEntity = event.hurtEntity
        const dimension = hurtEntity.dimension
        const pos = hurtEntity.location

        dimension.spawnParticle("rca:error_green", {x: pos.x, y: pos.y + 1.4, z: pos.z})
        dimension.playSound("item.shield.block", pos, {volume: 0.7, pitch: 2})

        hurtEntity.addEffect("oozing", 600 * 20, {showParticles: false})

        const effects = hurtEntity.getEffects()
        hurtEntity.applyDamage(effects.length, {damagingEntity: player, cause: EntityDamageCause.selfDestruct})
    }
}
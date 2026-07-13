import { EntityDamageCause, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class explosiveChestPlateSkill extends skillBase {
    constructor() {
        super()

        this.id = "§4爆発胸当て"
    }

    onHurt(player, event) {
        const cause = event.damageSource.cause

        if (
            cause === EntityDamageCause.blockExplosion || 
            cause === EntityDamageCause.entityExplosion ||
            cause === EntityDamageCause.fireTick ||
            cause === EntityDamageCause.fire || 
            cause === EntityDamageCause.selfDestruct
        ) return

        const dimension = player.dimension
        const pos = player.location

        if (pos.y < -64) return

        dimension.createExplosion(pos, 3, {
            breaksBlocks: true,
            causesFire: false,
            source: player
        })

        const damagingEntity = event.damageSource.damagingEntity
        if (damagingEntity) {
            player.applyDamage(5, {damagingEntity: damagingEntity, cause: EntityDamageCause.selfDestruct})
        } else {
            player.applyDamage(5, {damagingEntity: player, cause: EntityDamageCause.selfDestruct})
        }
    }
}
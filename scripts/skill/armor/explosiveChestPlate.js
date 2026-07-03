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
            cause === EntityDamageCause.fire
        ) return

        const dimension = player.dimension
        const pos = player.location

        player.addEffect("resistance", 2, {amplifier: 255, showParticles: false})

        dimension.createExplosion(pos, 4, {
            breaksBlocks: true,
            causesFire: true,
            source: player
        })
    }
}
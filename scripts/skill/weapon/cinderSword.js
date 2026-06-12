import { EntityDamageCause } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class cinderSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§f燃え残った剣"
    }

    onDamage(player, event) {
        const hurtEntity = event.hurtEntity
        if (player.getComponent("onfire")) {
            hurtEntity.applyDamage(1, {damagingEntity: player, cause: EntityDamageCause.none})
            hurtEntity.setOnFire(2)

            const dimension = player.dimension
            dimension.spawnParticle("rca:sweep_red_v", hurtEntity.location)
            dimension.playSound("mob.blaze.shoot", hurtEntity.location, {pitch: 2})
        }
    }
}
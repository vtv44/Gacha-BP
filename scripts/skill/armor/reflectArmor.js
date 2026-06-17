import { EntityDamageCause } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class reflectArmorSkill extends skillBase {
    // applydamage 変
    constructor() {
        super()

        this.id = "§6不完全な反射脚"
    }

    onHurt(player, event) {
        const {damage, hurtEntity} = event
        const dimension = player.dimension
        const {x, y, z} = player.location
        if (!hurtEntity) return

        hurtEntity.applyDamage(damage / 4, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
        dimension.spawnParticle("rca:just_guard", {x: x, y: y + 1.4, z: z})
        dimension.playSound("damage.thorns", player.location)
    }
}
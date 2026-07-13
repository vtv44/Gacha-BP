import { EntityComponentTypes, EntityDamageCause } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class valflameLeggingsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§4ヴァルフレイムレギンス"
    }

    equip(player) {
        const dimension = player.dimension
        const pos = player.location

        player.addEffect("fire_resistance", 20, {amplifier: 4, showParticles: false})
        player.setOnFire(2)

        for (const t of this.getTargets(player, pos, 5)) {
            t.setOnFire(2)
            t.playSound("mob.blaze.breathe", {volume: 0.6})
        }
    }

    onHurtBefore(player, event) {
        const { damage, damageSource } = event
        const damagingEntity = damageSource.damagingEntity
        const dimension = player.dimension
        const pos = player.location

        if (!damagingEntity) return

        if (damagingEntity.getComponent(EntityComponentTypes.OnFire) !== undefined) {
            event.cancel = true

            player.applyDamage(damage - 4, {damagingEntity: damagingEntity, cause: EntityDamageCause.entityAttack})
        }
    }
}
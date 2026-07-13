import { EntityComponentTypes, EntityDamageCause, system, world } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class valflameLeggingsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§4ヴァルフレイムレギンス"
        this.cooldown = 2
    }

    cooldownMessage(player) {}

    equip(player) {
        const dimension = player.dimension
        const pos = player.location

        player.addEffect("fire_resistance", 20, {amplifier: 4, showParticles: false})
        player.setOnFire(2)

        for (const t of this.getTargets(player, pos, 5)) {
            t.setOnFire(2)
            t.playSound("mob.blaze.breathe", {volume: 0.6})
            dimension.spawnParticle("gacha:ignite_flame", {
                x: t.location.x,
                y: t.location.y + 1.2,
                z: t.location.z
            })
        }
    }

    onHurtBefore(player, event) {
        if (!this.canUse(player)) return
        const { damage, damageSource } = event
        const damagingEntity = damageSource.damagingEntity
        const dimension = player.dimension
        const pos = player.location

        if (!damagingEntity) return

        if (damagingEntity.getComponent(EntityComponentTypes.OnFire) !== undefined) {
            event.cancel = true

            const addDamage = Math.floor(damage - 5)

            this.onCooldown(player)

            if (addDamage > 0) {
                system.run(() => {
                    player.applyDamage(damage - 5, {damagingEntity: damagingEntity, cause: EntityDamageCause.entityAttack})
                })
            }
        }
    }
}
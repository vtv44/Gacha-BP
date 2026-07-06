import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { CooldownManager } from "../cooldownManager";

export class damageCutLeggingsSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5ダメージカットのレギンス"
        this.cooldown = 4 * 20
    }

    onHurtBefore(player, event) {
        const { damage, damageSource } = event
        const damagingEntity = damageSource.damagingEntity;
        const dimension = player.dimension
        const pos = player.location

        if (CooldownManager.has(player, this.id)) return

        this.onCooldown(player)
        event.cancel = true

        if ((damage - 2) <= 0) {
            system.run(() => {
                player.addEffect("resistance", 4 * 20, {amplifier: 0})
                
                dimension.spawnParticle("minecraft:totem_particle", {x: pos.x, y: pos.y + 1.4, z: pos.z})
                dimension.playSound("hit.anvil", pos, {volume: 0.8, pitch: 1.5})
            })
            return
        }

        system.run(() => {
            dimension.spawnParticle("ptl:fire_scatter_instant", {x: pos.x, y: pos.y + 1.4, z: pos.z})
            dimension.playSound("hit.anvil", pos, {volume: 0.8, pitch: 0.8})

            if (damagingEntity) {
                player.applyDamage(damage - 2, {damagingEntity: damagingEntity, cause: EntityDamageCause.entityAttack})
            } else {
                player.applyDamage(damage - 2)
            }
        })
    }
}
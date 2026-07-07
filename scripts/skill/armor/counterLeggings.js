import { EntityDamageCause, world } from "@minecraft/server";
import { CooldownManager } from "../cooldownManager";
import { skillBase } from "../skillBase";

export class counterLeggingsSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5反撃のレギンス"
        this.cooldown = 20 * 20
    }

    cooldownMessage(player) {
        const cooltime = CooldownManager.getRemaining(player, this.id) / 20

        player.onScreenDisplay.setActionBar(
            `[${this.id}§f] §cスキルは${cooltime}秒間使用できません`
        )
    }

    onHurt(player, event) {
        const damageSource = event.damageSource

        if (damageSource?.cause === EntityDamageCause.entityAttack && player.isSneaking) {
            if (!this.canUse(player)) return

            this.onCooldown(player)
            const dimension = player.dimension
            const pos = player.location
            const targets = this.getTargets(player, pos, 4)

            dimension.spawnParticle("minecraft:knockback_roar_particle", {x: pos.x, y: pos.y + 1.4, z: pos.z})
            dimension.spawnParticle("gacha:counter_particle", {x: pos.x, y: pos.y + 1.4, z: pos.z})
            dimension.playSound("random.totem", pos, {volume: 0.5, pitch: 2})
            dimension.playSound("mob.warden.sonic_boom", pos, {volume: 0.3, pitch: 1.2})
            
            for (const t of targets) {
                t.applyDamage(7, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
                t.applyKnockback({x: 0, z: 0}, 0.8)
            }
        }
    }
}
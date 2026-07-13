import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase, tickSkillBase } from "../skillBase";

export class starChaserBootsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§5スターチェイサーブーツ"
        this.cooldown = 10
    }

    cooldownMessage(player) {}

    equip(player) {
        player.addEffect("weakness", 20, {amplifier: 0, showParticles: false})
    }

    onDamage(player, event) {
        if (!this.canUse(player)) return
        this.onCooldown(player)

        const hurtEntity = event.hurtEntity
        const dimension = hurtEntity.dimension
        const pos = hurtEntity.location
        const pPos = {
            x: pos.x, y: pos.y + 1.2, z: pos.z
        }

        system.runTimeout(() => {
            hurtEntity.applyDamage(3, {damagingEntity: player, cause: EntityDamageCause.magic})

            dimension.spawnParticle("gacha:star_chaser", pPos)
            dimension.playSound("mob.shulker.shoot", pPos, {volume: 0.7, pitch: 1.4})
        }, 2)
    }
}
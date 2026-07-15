import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase, tickSkillBase } from "../skillBase";

export class blazingSword extends tickSkillBase {
    constructor() {
        super()

        this.id = "§5燃え盛る剣"
        this.cooldown = 15 * 20
    }

    execute(player) {
        this.onCooldown(player)

        const dimension = player.dimension
        const dir = player.getViewDirection()
        const headPos = player.getHeadLocation()

        for (let i = 1; i <= 8; i++) {
            system.runTimeout(() => {
                const pos = player.location
                const atkPos = {
                    x: pos.x,
                    y: pos.y + 1.2,
                    z: pos.z,
                }

                dimension.spawnParticle("gacha:ignite_flame", atkPos)
                dimension.playSound("mob.blaze.shoot", atkPos, {pitch: 2.2})

                for (const t of this.getTargets(player, atkPos, 2)) {
                    t.applyDamage(5, {damagingEntity: player, cause: EntityDamageCause.fire})
                    t.setOnFire(8)
                    dimension.spawnParticle("rca:sweep_red", t.location)
                    dimension.spawnParticle("rca:guard_red", t.location)
                    dimension.playSound("mob.player.hurt_on_fire", t.location, {pitch: 0.7})
                }
            }, i)
        }

        player.applyKnockback({x: dir.x * 3, z: dir.z * 3}, dir.y)
        // 火炎耐性がついてるときは秒数/3秒間炎がつくらしい
        player.setOnFire(36)
    }

    has(player) {
        if (!this.canAddEffect(player)) return

        player.addEffect("fire_resistance", 20, {amplifier: 4, showParticles: false})
    }

    onDamage(player, event) {
        const hurtEntity = event.hurtEntity
        if (player.getComponent("onfire") && event.damageSource.cause === EntityDamageCause.entityAttack) {
            hurtEntity.applyDamage(2, {damagingEntity: player, cause: EntityDamageCause.selfDestruct})
            hurtEntity.setOnFire(4)

            const dimension = player.dimension
            dimension.spawnParticle("rca:sweep_red_v", hurtEntity.location)
            dimension.playSound("mob.blaze.shoot", hurtEntity.location, {pitch: 2})
        }
    }
}
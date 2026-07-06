import { EntityDamageCause, EquipmentSlot, GameMode, system } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class nightShroudSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§b闇の抱擁"
        this.cooldown = 90 * 20
    }

    static death = new Map()

    cooldownMessage(player) {
        player.onScreenDisplay.setActionBar(`§8EXPOSED`)
    }

    equip(player) {
        const armor = player.getComponent("equippable")
        armor.setEquipment(EquipmentSlot.Head)
        armor.setEquipment(EquipmentSlot.Legs)
        armor.setEquipment(EquipmentSlot.Feet)

        player.addEffect("invisibility", 10 * 20, {amplifier: 4, showParticles: false})

        if (this.canAddEffect(player)) {
            player.addEffect("speed", 10 * 20, {amplifier: 1, showParticles: false})
            player.addEffect("jump_boost", 10 * 20, {amplifier: 4, showParticles: false})
            player.addEffect("regeneration", 10 * 20, {amplifier: 1, showParticles: false})
            player.addEffect("fire_resistance", 10 * 20, {amplifier: 4, showParticles: false})
        }
    }

    onDamage(player, event) {
        if (!this.canUse(player)) return

        this.onCooldown(player)

        const dimension = player.dimension
        const hurtEntity = event.hurtEntity
        const pos = hurtEntity.location
        const max = hurtEntity.getComponent("health").effectiveMax

        dimension.spawnParticle("rca:error_red", pos)
        dimension.spawnParticle("rca:guard_red", pos)
        dimension.spawnParticle("rca:black_flash", pos)
        dimension.playSound("random.totem", pos, {volume: 0.6, pitch: 0.8})

        hurtEntity.applyDamage(max / 2, {damagingEntity: player, cause: EntityDamageCause.entityAttack})

        player.onScreenDisplay.setActionBar(`§l§4EXPOSED`)
    }

    onHurtBefore(player, event) {
        const { damage } = event

        const dimension = player.dimension
        const pos = player.location
        const health = player.getComponent("health")
        const current = health.currentValue

        if ((current - damage) < 0 && !nightShroudSkill.death.get(player.id)) {
            event.cancel = true
            nightShroudSkill.death.set(player.id, true)

            system.run(() => {
                dimension.spawnParticle("kitpvp:ninja_shuriken", {x: pos.x, y: pos.y + 1.2, z: pos.z})
                dimension.playSound("mob.wither.ambient", pos)

                player.playSound("mob.elderguardian.curse", {pitch: 0.8, volume: 0.8})
                health.resetToMaxValue()
                player.onScreenDisplay.setActionBar(`§l§7REVIVE`)
                player.setGameMode(GameMode.Spectator)
                this.clearAllEffect(player)
            })

            system.runTimeout(() => {
                player.setGameMode(GameMode.Survival)
                player.sendMessage(" \n§l§7次の機会はない。しくじるなよ\n ")
                player.playSound("mob.wither.shoot", {volume: 0.7})
            }, 101)
        }
    }

    onHurt(player, event) {
        const dimension = player.dimension
        const pos = player.location

        for (let i = 0; i <= 10; i++) {
            system.runTimeout(() => {
                dimension.spawnParticle("gacha:night_shroud_smoke", player.location)
            }, i)
        }
        dimension.playSound("random.fizz", pos, {volume: 0.8, pitch: 0.5})
    }
}
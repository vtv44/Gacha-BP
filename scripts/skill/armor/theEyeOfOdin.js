import { system, world } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class theEyeOfOrdinSkill extends tickSkillBase {
    static dodgePercent = new Map()

    constructor() {
        super()

        this.id = "§b=オーディンの目="
    }

    onHurtBefore(player, event) {
        const {damage, damageSource} = event
        const dp = theEyeOfOrdinSkill.dodgePercent
        const rand = Math.floor(Math.random() * 100)
        const dimension = player.dimension
        const location = player.location
        const {x, y, z} = location

        let percent = dp.get(player.id)
        if (!percent) {
            percent = 100
        }

        if (rand < percent) {
            event.cancel = true
            if (percent >= 50 && damageSource.damagingEntity?.typeId === "minecraft:player") {
                dp.set(player.id, percent - 1)
                system.run(() => {
                    dimension.spawnParticle("minecraft:critical_hit_emitter", {x: x, y: y + 1.4, z: z})
                })
            }

            system.run(() => {
                player.onScreenDisplay.setActionBar(`§l§b==DODGE==\n§f${rand} < ${percent}%`)
                dimension.playSound("random.fizz", location, {pitch: 2.5})
                dimension.spawnParticle("gacha:dodge", location)
            })
        } else {
            system.run(() => {
                player.onScreenDisplay.setActionBar(`§l§c=DAMAGE=\n§4${rand} §f> ${percent}%`)
            })
        }
    }

    equip(player) {
        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (current < max / 2) {
            player.addEffect("speed", 2 * 20, {amplifier: 4, showParticles: false})
            player.addEffect("strength", 2 * 20, {amplifier: 2, showParticles: false})
            player.addEffect("jump_boost", 2 * 20, {amplifier: 4, showParticles: false})
            player.addEffect("resistance", 2 * 20, {amplifier: 2, showParticles: false})
        }

        if (!this.canAddEffect(player)) return

        player.addEffect("speed", 2 * 20, {amplifier: 2, showParticles: false})
        player.addEffect("strength", 2 * 20, {amplifier: 0, showParticles: false})
        player.addEffect("jump_boost", 2 * 20, {amplifier: 1, showParticles: false})
        player.addEffect("resistance", 2 * 20, {amplifier: 0, showParticles: false})
    }
}
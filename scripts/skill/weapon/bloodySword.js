import { EntityDamageCause, system, world } from "@minecraft/server";
import { CooldownManager } from "../cooldownManager";
import { skillBase } from "../skillBase";

export class bloodySwordSkill extends skillBase {
    static useCount = new Map()

    constructor() {
        super()

        this.id = "§b血塗れの剣"
        this.cooldown = 30
    }

    cooldownMessage(player) {
        player.onScreenDisplay.setActionBar(`§4== Unavailable ==`)
    }

    execute(player) {
        const dimension = player.dimension
        const pos = player.location
        const pPos = {
            x: pos.x,
            y: pos.y + 1.2,
            z: pos.z
        }

        if (!player.isSneaking) {
            // 通常
            this.onCooldown(player)
            this.slash(player)

            system.runTimeout(() => {
                this.slash(player)
            }, 10)

        } else {
            const health = player.getComponent("health")
            const current = health.currentValue
            const max = health.effectiveMax

            if (current < max / 2 && 
                (bloodySwordSkill.useCount.get(player.id) === undefined || 
                bloodySwordSkill.useCount.get(player.id) < system.currentTick)
            ) {
                const targets = this.getTargets(player, pos, 30)
                if (targets[0]) {
                    this.onCooldown(player, 10 * 20)
                    bloodySwordSkill.useCount.set(player.id, system.currentTick + 180 * 20)

                    const location = targets[0].location
                    const tHealth = targets[0].getComponent("health")
                    const heal = tHealth.currentValue - 1

                    targets[0].applyDamage(heal, {damagingEntity: player, cause: EntityDamageCause.magic})
                    targets[0].sendMessage(` \n§l§c${player.name}§r§4に体力をすべて奪われた\n `)
                    targets[0].runCommand("effect @s clear")
                    targets[0].runCommand("hud @s hide health")
                    targets[0].addEffect("resistance", 10 * 20, {amplifier: 255})

                    system.runTimeout(() => {
                        targets[0].applyDamage(heal, {damagingEntity: player, cause: EntityDamageCause.magic})
                        targets[0].runCommand("hud @s reset health")
                    }, 20 * 20)

                    dimension.spawnParticle("gacha:hell_punishment", location)
                    dimension.playSound("mob.zombie.remedy", location, {pitch: 1.8, volume: 0.8})
                    dimension.playSound("mob.elderguardian.curse", location, {pitch: 1.5})

                    if (max < current + health) {
                        health.resetToMaxValue()
                    } else {
                        health.setCurrentValue(current + health)
                    }
                    player.addEffect("resistance", 10 * 20, {amplifier: 255})

                    dimension.spawnParticle("gacha:bloody_area_smoke", pPos)
                    for (let i = 0; i <= 5; i++) {
                        system.runInterval(() => {
                            dimension.spawnParticle("rca:guard_red", pPos)
                            dimension.playSound("firework.blast", pPos, {volume: 2})
                        }, i)
                    }
                    return
                }
            }

            // 範囲攻撃
            this.onCooldown(player)

            player.addEffect("resistance", 35, {amplifier: 255, showParticles: false})
            player.addEffect("slowness", 15, {amplifier: 1, showParticles: false})

            dimension.spawnParticle("gacha:bloody_area_smoke", pPos)
            dimension.playSound("mob.creaking.death", pPos, {pitch: 1.5})

            system.runTimeout(() => {
                dimension.spawnParticle("gacha:bloody_area_slash", pPos)
                for (let i = 0; i <= 10; i++) {
                    system.runTimeout(() => {
                        const targets = this.getTargets(player, pPos, 5)

                        for (const t of targets) {
                            t.applyDamage(3, {damagingEntity: player, cause: EntityDamageCause.selfDestruct})
                            
                            t.addEffect("slowness", 3 * 20)
                            t.addEffect("wither", 3 * 20, {amplifier: 2})
                            t.addEffect("blindness", 10 * 20)
                        }

                        dimension.playSound("mob.irongolem.crack", pPos, {pitch: 0.6, volume: 0.4})
                    }, i + 1)
                }
            }, 10)
        }
    }

    slash(player) {
        const dimension = player.dimension
        const dir = player.getViewDirection()
        const pos = player.location
        const pPos = {
            x: pos.x,
            y: pos.y + 1.2,
            z: pos.z
        }

        dimension.playSound("mob.wither.shoot", pPos, {pitch: 1.2, volume: 0.8})

        for (let i = 1; i <= 16; i++) {
            const sPos = {
                x: pPos.x + dir.x * i,
                y: pPos.y + dir.y * i + 1,
                z: pPos.z + dir.z * i,
            }

            system.runTimeout(() => {
                dimension.spawnParticle("gacha:bloody_slash", sPos)
                dimension.spawnParticle("gacha:redstone_smoke", sPos)
                dimension.playSound("mob.irongolem.throw", sPos)
                    
                for (const t of this.getTargets(player, sPos, 1)) {
                    t.applyDamage(5, {damagingEntity: player, cause: EntityDamageCause.selfDestruct})
                    t.addEffect("wither", 5 * 20, {amplifier: 3})

                    dimension.spawnParticle("rca:sweep_red_cross", {
                        x: t.location.x,
                        y: t.location.y + 1.4,
                        z: t.location.z
                    })
                }
            }, i)
        }
    }
}
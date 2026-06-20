import { EntityDamageCause, ItemStack, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class magicTechGunSwordSkill extends skillBase {
    static counter = new Map();

    constructor() {
        super()

        this.id = "§b=魔銃剣= ディエゴ・ラ・イーフォルト"
        this.cooldown = 8 * 20
    }

    execute(player) {
        if (player.isSneaking) {
            this.itemChange(player)
            return
        }
        if (this.hasItem(player) === "gun") {
            // 銃
            let useCount = 0
            const count = magicTechGunSwordSkill.counter.get(player.id)
            if (count >= 4) {
                this.shot(player, true)
                useCount = 0
            } else {
                this.shot(player)
                if (!count) {
                    useCount = 1
                } else {
                    useCount = count + 1
                }
            }
            magicTechGunSwordSkill.counter.set(player.id, useCount)
            
        } else if (this.hasItem(player) === "sword") {
            // 剣
            this.onCooldown(player)
            const targets = this.getTargets(player, player.location, 10)

            for (const t of targets) {
                t.runCommand("inputpermission set @s movement disabled")
            }

            for (let i = 0; i <= targets.length - 1; i++) {
                if (!targets[i].isValid) continue;
                system.runTimeout(() => {
                    this.slash(player, targets[i])
                    targets[i].runCommand("inputpermission set @s movement enabled")
                }, (i + 1) * 10)
            }
        }
    }

    onDamage(player, event) {
        const hurtEntity = event.hurtEntity
        const dimension = hurtEntity.dimension

        if (this.hasItem(player) === "gun") {
            system.runTimeout(() => {
                if (!hurtEntity.isValid) return
                const location = hurtEntity.location

                dimension.spawnParticle("rpg:blue_mini_magic_circle", location)
                dimension.playSound("mob.blaze.shoot", location, {pitch: 2.5})
                dimension.playSound("random.pop", location, {pitch: 0.2})

                for (let i = 0; i <= 60; i++) {
                    const atkPos = {
                        x: location.x,
                        y: location.y + i / 2 - 1,
                        z: location.z
                    }
                    dimension.spawnParticle("gacha:techgun_smoke", atkPos)
                    for (const t of this.getTargets(player, atkPos, 1)) {
                        t.applyDamage(4)
                        t.setOnFire(4)
                    }
                }
            }, 20)
        }
        if (this.hasItem(player) === "sword") {
            dimension.spawnParticle("kitpvp:ghost_phantomization_vanish", player.location)
            system.runTimeout(() => {
                if (!hurtEntity.isValid) return
                this.slash(player, hurtEntity)
            }, 6)
        }
    }

    itemChange(player) {
        const slot = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex)
        player.playSound("camera.take_picture", {pitch: 0.6})
        if (this.hasItem(player) === "sword") {
            const item = new ItemStack("gacha:magic_tech_gun")
            item.nameTag = "§b=魔銃剣= ディエゴ・ラ・イーフォルト"
            item.setLore([
                "§b[魔弾] §5右クリック 攻撃",
                "§5魔術の真髄による弾丸を放つ",
                "§5三発目に放たれる弾丸は強化される",
                "§5[攻撃時] 対象に弾丸による追撃を放つ"
            ])
            slot.setItem(item)
            return
        }
        if (this.hasItem(player) === "gun") {
            const item = new ItemStack("gacha:magic_tech_sword")
            item.nameTag = "§b=魔銃剣= ディエゴ・ラ・イーフォルト"
            item.setLore([
                "§b[魔斬] §5右クリック 攻撃",
                "§5魔術の真髄による連鎖斬撃を放つ",
                "§5周囲のプレイヤー全てを対象にし、背後から斬り付ける",
                "§5[攻撃時] 対象に連撃攻撃を放つ"
            ])
            slot.setItem(item)
            return
        }
    }

    hasItem(player) {
        const item = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex).getItem()
        if (item.typeId === "gacha:magic_tech_gun") return "gun"
        if (item.typeId === "gacha:magic_tech_sword") return "sword"
    }

    shot(player, power = false) {
        const dimension = player.dimension
        const location = player.location
        const dir = player.getViewDirection()
        const mcPos = {
            x: location.x + dir.x * 0.6, 
            y: location.y + dir.y * 0.6 + 1.7, 
            z: location.z + dir.z * 0.6
        }
        dimension.playSound("mob.elderguardian.curse", location, {volume: 0.7, pitch: 2})
        if (power) {
            dimension.spawnParticle("rpg:blue_v_magic_circle", mcPos)

            system.runTimeout(() => {
                dimension.playSound("mob.irongolem.hit", location, {pitch: 0.8, volume: 0.5})

                for (let i = 0; i <= 25; i++) {
                    const atkPos = {
                        x: location.x + dir.x * (i + 2),
                        y: location.y + dir.y * (i + 2) + 1.7,
                        z: location.z + dir.z * (i + 2),
                    }
                    const {x, y, z} = atkPos
                    if (y < -64) return
                    dimension.spawnParticle("rpg:red_light_blue_magic_smoke", atkPos)
                    dimension.runCommand(`fill ${x + 1} ${y + 1} ${z + 1} ${x - 1} ${y - 1} ${z - 1} air`)
                    const targets = this.getTargets(player, atkPos, 2)
                    for (const t of targets) {
                        t.applyDamage(20)
                    }
                }
            }, 20)
        } else {
            dimension.spawnParticle("rpg:blue_v_mini_magic_circle", mcPos)
            dimension.playSound("mob.blaze.shoot", location, {pitch: 2.5})
            dimension.playSound("random.pop", location, {pitch: 0.2})

            for (let i = 0; i <= 50; i++) {
                const atkPos = {
                    x: location.x + dir.x * ((i + 2) / 2),
                    y: location.y + dir.y * ((i + 2) / 2) + 1.7,
                    z: location.z + dir.z * ((i + 2) / 2),
                }
                if (atkPos.y < -64) return
                dimension.spawnParticle("gacha:techgun_smoke", atkPos)
            }

            const teamScore = world.scoreboard.getObjective("team").getScore(player)
            const targets = player.getEntitiesFromViewDirection({
                maxDistance: 25,
                scoreOptions: [{
                    objective: "team",
                    minScore: teamScore,
                    maxScore: teamScore,
                    exclude: true
                }],
            })
            for (const t of targets) {
                t.entity.applyDamage(9)
            }
        }
    }

    slash(player, target) {
        const dimension = target.dimension
        const location = target.location
        const dir = target.getViewDirection()
        const tpPos = {
            x: location.x + dir.x * -3,
            y: location.y,
            z: location.z + dir.z * -3
        }
        const {x, y, z} = tpPos

        player.addEffect("speed", 1 * 20, {amplifier: 4})
        player.teleport(tpPos, {facingLocation: location})
        player.runCommand(`fill ${x + 2} ${y + 2} ${z + 2} ${x - 2} ${y} ${z - 2} air`)

        system.runTimeout(() => {
            player.applyKnockback({x: dir.x * 3, z: dir.z * 3}, 0.3)
            dimension.spawnParticle("kitpvp:ninja_shuriken", player.location)
            dimension.spawnParticle("rca:sweep_random_white", location)
            dimension.playSound("random.anvil_land", location, {pitch: 2.6})

            for (const t of this.getTargets(player, location, 3)) {
                t.applyDamage(8)
            }
        }, 3)
    }
}
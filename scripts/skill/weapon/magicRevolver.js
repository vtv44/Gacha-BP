import { EntityDamageCause } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { CooldownManager } from "../cooldownManager";

export class magicRevolverSkill extends skillBase {
    static counter = new Map();

    constructor() {
        super()

        this.id = "§d=魔術銃= レボルブ"
        this.cooldown = 6 * 20
    }

    execute(player) {
        const dir = player.getViewDirection()
        const location = player.location
        const dimension = player.dimension

        dimension.playSound("random.anvil_land", player.location, {pitch: 2.5, volume: 0.8})
        dimension.playSound("mob.warden.death", player.location, {pitch: 2.5, volume: 0.8})
        for (let i = 0; i <= 13; i++) {
            const atkPos = {
                x: location.x + dir.x * (i * 2),
                y: location.y + dir.y * (i * 2) + 1.4,
                z: location.z + dir.z * (i * 2),
            }
            const {x, y, z} = atkPos
            if (y < -64) continue
            dimension.spawnParticle("gacha:magic_revolver_smoke", atkPos)
            const targets = this.getTargets(player, atkPos, 2)
            for (const target of targets) {
                target.applyDamage(10, {damagingEntity: player, cause: EntityDamageCause.entityAttack})
                target.setOnFire(6)
            }
        }

        let useCount = 1
        const count = magicRevolverSkill.counter.get(player.id)
        if (count) {
            useCount = 1 + count
        }
        player.onScreenDisplay.setActionBar(countActionbarText(useCount))
        
        if (useCount >= 6) {
            player.playSound("random.fizz", {pitch: 1, volume: 0.8})
            magicRevolverSkill.counter.set(player.id, 0)
            player.applyDamage(1, {damagingEntity: player, cause: EntityDamageCause.none})
            this.onCooldown(player)
            return
        }
        magicRevolverSkill.counter.set(player.id, useCount)
    }

    cooldownMessage(player) {
        const cooltime = CooldownManager.getRemaining(player, this.id) / 20
        player.onScreenDisplay.setActionBar(`§7Reloading... ${cooltime}sec`)
        player.playSound("camera.take_picture", {pitch: 0.7, volume: 1})
    }
}

function countActionbarText(count) {
    let text = ""
    for (let i = 5; i >= count; i--) {
        text += "§g＊"
    }
    for (let i = 1; i <= count; i++) {
        text += "§8＊"
    }
    return text
}
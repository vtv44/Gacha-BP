import { world } from "@minecraft/server"
import { skillBase } from "../skillBase"

export class harubaguSpecialLevySKill extends skillBase {
    constructor() {
        super()

        this.id = "§dはるばぐ工房の特別徴収マシーン"
    }

    execute(player) {
        const location = player.location
        const targets = this.getTargets(player, location, 7)
        let heal = 0

        if (!targets[0]) {
            player.playSound("random.fizz")
            player.onScreenDisplay.setActionBar("§c近くに敵がいない...")
            return
        }

        this.consumeItem(player)
        
        player.dimension.spawnParticle("gacha:drain_circle", location)
        player.playSound("mob.eldurguardian.curse", {volume: 0.6, pitch: 2})

        for (const t of targets) {
            t.playSound("voice.harubagu_1")
            this.drainEffect(player, t)

            t.applyDamage(8)
            heal = heal + 8
        }

        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (max < current + heal) {
            health.resetToMaxValue()
        } else {
            health.setCurrentValue(current + heal)
        }
    }

    drainEffect(player, target) {
        const effects = target.getEffects()
        for (const e of effects) {
            if (!e || e.typeId === "minecraft:health_boost") continue

            player.addEffect(e.typeId, e.duration, {amplifier: e.amplifier})
            target.removeEffect(e.typeId)
        }
    }
}
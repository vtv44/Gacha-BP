import { CooldownManager } from "../cooldownManager";
import { skillBase } from "../skillBase";

export class absorptionLeggings extends skillBase {
    constructor() {
        super()

        this.id = "§d吸収レギンス"
        this.cooldown = 20 * 20
    }

    cooldownMessage(player) {
        const cooltime = CooldownManager.getRemaining(player, this.id) / 20

        player.onScreenDisplay.setActionBar(
            `[${this.id}§f] §cスキルは${cooltime}秒間使用できません`
        )
    }

    onHurt(player, event) {
        const {damage, damageSource} = event

        const dimension = player.dimension
        const pos = player.location
        const pPos = {
            x: pos.x,
            y: pos.y + 1.2,
            z: pos.z,
        }

        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        dimension.spawnParticle("rca:lightning", pPos)
        dimension.playSound("respawn_anchor.charge", pPos, {volume: 0.8})

        if (max < current + damage / 2) {
            health.resetToMaxValue()
        } else {
            health.setCurrentValue(current + damage / 2)
        }

        if (this.canUse(player)) {
            this.onCooldown(player)
            player.addEffect("absorption", 15 * 20, {amplifier: 3, showParticles: false})
            player.addEffect("regeneration", 5 * 20, {amplifier: 1, showParticles: false})

            player.spawnParticle("rca:error_yellow", pPos)
            player.playSound("random.anvil_land", {volume: 0.7, pitch: 2})
        }
    } 
}
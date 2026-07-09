import { skillBase } from "../skillBase";

export class igniteChestPlateSkill extends skillBase {
    constructor() {
        super()

        this.id = "§f着火胸当て"
        this.cooldown = 6 * 20
    }

    cooldownMessage() {}

    onHurt(player, event) {
        const damager = event.damageSource.damagingEntity

        if (!damager || !this.canUse(player)) return

        const dimension = player.dimension

        dimension.playSound("mob.blaze.breathe", damager.location, {pitch: 1.2})
        damager.setOnFire(2)
    }
}
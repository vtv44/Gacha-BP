import { skillBase } from "../skillBase";

export class greenMagicSKill extends skillBase {
    constructor() {
        super()

        this.id = "§a緑色の魔力"
        this.cooldown = 30 * 20
    }

    execute(player) {
        this.onCooldown(player)
        
        const dimension = player.dimension
        const location = player.location

        player.removeEffect("poison")

        dimension.spawnParticle("rca:spell_spread_green", location)
        dimension.spawnParticle("rca:spell_green", location)
        dimension.playSound("mob.witch.celebrate", location)

        for (const t of this.getTargets(player, location, 7)) {
            if (this.canAddEffect(player)) t.addEffect("poison", 5 * 20, {amplifier: 1})
        }
    }
}
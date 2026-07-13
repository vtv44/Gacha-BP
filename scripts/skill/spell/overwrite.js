import { system } from "@minecraft/server"
import { skillBase } from "../skillBase"

export class overwriteSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6OVERWRITE"
        this.cooldown = 10 * 20
    }

    execute(player) {
        this.consumeItem(player)
        this.onCooldown(player)

        const dimension = player.dimension
        const pos = player.location
        const pPos = {
            x: pos.x,
            y: pos.y + 1.4,
            z: pos.z
        }

        player.getComponent("health").resetToMaxValue()
        player.getComponent("player.hunger").resetToMaxValue()
        player.getComponent("player.saturation").resetToMaxValue()

        this.clearAllEffect(player)

        dimension.spawnParticle("rca:error_pink", pPos)
        dimension.spawnParticle("rpg:tame_heart_emitter", pPos)
        dimension.playSound("mob.warden.sonic_boom", pos, {volume: 0.4, pitch: 1.4})
        dimension.playSound("note.bit", pos, {pitch: 0.3})
        dimension.playSound("random.click", pPos)

        player.onScreenDisplay.setActionBar(`§l§d[OVERWRITE]`)
    }
}
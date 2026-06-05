import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class jammingSwordSkill extends skillBase {
    static ct = new Map()
    constructor() {
        super()

        this.id = "§4阻害剣"
    }

    onDamage(player, event) {
        const hurtEntity = event.hurtEntity
        const dimension = player.dimension

        jammingSwordSkill.ct.set(hurtEntity.id, system.currentTick + 200)

        dimension.spawnParticle("rca:error_red", hurtEntity.location)
        dimension.spawnParticle("rca:error_blue", hurtEntity.location)
        dimension.spawnParticle("rca:error_black", hurtEntity.location)
        dimension.playSound("mob.guardian.land_idle", hurtEntity.location, {pitch: 0.25})

        hurtEntity.runCommand("hud @s hide all")
        hurtEntity.runCommand("camera @s set fade 0 0 0.3 color 0 0 0")

        system.runTimeout(() => {
            if (jammingSwordSkill.ct.get(hurtEntity.id) > system.currentTick || !hurtEntity.isValid) return

            dimension.playSound("mob.guardian.hit", hurtEntity.location)

            hurtEntity.runCommand("hud @s reset all")
        }, 200)
    }
}
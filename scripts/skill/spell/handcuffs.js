import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class handcuffsSkill extends skillBase {
    handcuffCT = new Map()

    constructor() {
        super()

        this.id = "§4手錠"
        this.cooldown = 15 * 20
    }

    onDamage(player, event) {
        const hurtEntity = event.hurtEntity
        const dimension = player.dimension
        const pos = hurtEntity.location

        this.handcuffCT.set(hurtEntity.id, system.currentTick + 200)

        hurtEntity.runCommand("inputpermission set @s movement disabled")
        hurtEntity.addEffect("resistance", 10 * 20)
        
        dimension.playSound("close.iron_door", pos, {pitch: 0.6})
        dimension.spawnParticle("minecraft:magic_critical_hit_emitter", {x: pos.x, y: pos.y + 1.4, z: pos.z})

        system.runTimeout(() => {
            if (this.handcuffCT.get(hurtEntity.id) > system.currentTick || !hurtEntity.isValid) return
            
            const pos2 = hurtEntity.location

            hurtEntity.runCommand("inputpermission set @s movement enabled")
            dimension.playSound("open.iron_door", pos2, {pitch: 0.65})
            dimension.spawnParticle("minecraft:egg_destroy_emitter", {x: pos2.x, y: pos2.y + 1.4, z: pos2.z})
        }, 200)
    }
}
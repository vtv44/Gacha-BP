import { skillBase } from "../skillBase";

export class weaknessSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§a弱さの剣"
    }

    onDamage(player, event) {
        const hurtEntity = event.hurtEntity
        const dimension = hurtEntity.dimension
        const location = hurtEntity.location
        const {x, y, z} = location

        if (!this.canAddEffect(hurtEntity)) return
        hurtEntity.addEffect("weakness", 2 * 20)
        dimension.spawnParticle("gacha:weakness_particle", {x: x, y: y + 1.4, z: z})
        dimension.playSound("mob.pillager.hurt", location)
    }
}
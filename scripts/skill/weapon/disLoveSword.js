import { EntityDamageCause } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { confessionSkill } from "../spell/confession";

export class disLoveSword extends skillBase {
    constructor() {
        super()

        this.id = "§4失恋の剣"
    }

    onDamage(player, event) {
        const hurtEntity = event.hurtEntity
        const dimension = player.dimension

        if (hurtEntity.id === confessionSkill.love.get(player.id)) {
            const pos = hurtEntity.location

            player.sendMessage("§4ようやく見つけたね。あなたの想いを棄てるなんてことをしたクズを。")
            hurtEntity.applyDamage("999", {damagingEntity: player, cause: EntityDamageCause.selfDestruct})

            dimension.spawnParticle("rca:black_out", {x: pos.x, y: pos.y + 1.2, z: pos.z})
            dimension.playSound("random.totem", pos, {pitch: 0.8, volume: 0.8})
        }
    }
}
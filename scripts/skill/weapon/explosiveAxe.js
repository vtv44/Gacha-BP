import { system } from "@minecraft/server";
import { gachaBase } from "../../gacha/gachaBase";
import { skillBase } from "../skillBase";

export class explosiveAxeSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5爆裂斧"
        this.cooldown = 2 * 20
    }

    execute(player) {
        this.onCooldown(player)
        const dimension = player.dimension
        player.runCommand("inputpermission set @s movement disabled")
        for (let i = 0; i <= 2; i++) {
            system.runTimeout(() => {
                
                dimension.spawnParticle("gacha:black_smoke_particle", getAttackPosition(player))
                dimension.playSound("random.click", player.location, {volume: 1, pitch: 1 + (i / 2)})
            }, i * 7)
        }
        system.runTimeout(() => {
            const dir = player.getViewDirection()
            dimension.createExplosion(getAttackPosition(player), 2.5, {
                breaksBlocks: true,
                causesFire: true,
                source: player
            })
            player.applyKnockback({x: dir.x * -2, z: dir.z * -2}, 0.5)
            player.runCommand("inputpermission set @s movement enabled")
        }, 20)
    }
}

function getAttackPosition(player) {
    const dir = player.getViewDirection()
    const location = player.location
    const atkPos = {
        x: location.x + dir.x * 3.3,
        y: location.y + dir.y * 3.3 + 1.2,
        z: location.z + dir.z * 3.3
    }
    return atkPos
}
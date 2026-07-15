import { system } from "@minecraft/server"
import { skillBase } from "../skillBase"

export class blackholeSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5ブラックホール"
        this.cooldown = 12 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const location = player.location
        const pos = {
            x: location.x, 
            y: location.y + 1.4,
            z: location.z
        }

        this.onCooldown(player)
        this.consumeItem(player)

        for (let i = 1; i <= 100; i++) {
            system.runTimeout(() => {
                dimension.spawnParticle("gacha:blackhole", pos)
                dimension.spawnParticle("gacha:blackhole_smoke", pos)

                const targets = this.getTargets(player, pos, 20);
                for (const target of targets) {
                    if (!target.isValid) continue;
                    const loc = target.location;
                    const dx = pos.x - loc.x;
                    const dy = pos.y - loc.y;
                    const dz = pos.z - loc.z;
                    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

                    target.applyKnockback({ x: dx / len, z: dz / len }, dy / len);
                }
            }, i * 2)
        }
    }
}
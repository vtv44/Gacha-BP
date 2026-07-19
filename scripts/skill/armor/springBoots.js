import { system } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";
import { CooldownManager } from "../cooldownManager";

export class springBootsSkill extends tickSkillBase {
    constructor() {
        super()
        this.id = "§dスプリングブーツ"
        this.cooldown = 60
    }

    static sneakTicks = new Map();

    equip(player) {
        if (CooldownManager.has(player, this.id)) return;

        const id = player.id;

        if (!player.isSneaking) {
            springBootsSkill.sneakTicks.delete(id);
            return;
        }

        const ticks = (springBootsSkill.sneakTicks.get(id) || 0) + 5;
        springBootsSkill.sneakTicks.set(id, ticks);

        if (ticks === 5 || ticks === 10 || ticks === 20) {
            player.playSound("random.click", { pitch: 1.5 });
        }

        if (ticks >= 25) {
            springBootsSkill.sneakTicks.delete(id);
            CooldownManager.set(player, this.id, this.cooldown);

            const pos = player.location;
            player.dimension.playSound("random.explode", pos, { pitch: 1.5 });
            player.dimension.spawnParticle("ptl:fire_pillar_instant", pos);
            player.applyKnockback({ x: 0, z: 0 }, 2.0);
        }
    }
}

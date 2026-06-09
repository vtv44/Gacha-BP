import { system } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

const regenCooldown = new Set();

export class superRegenerationChestPlateSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§dスーパーリジェネレーションチェストプレート";
    }

    equip(player) {
        if (!this.canAddEffect(player)) return;
        if (regenCooldown.has(player.id)) return;

        player.addEffect("regeneration", 5 * 20, { amplifier: 1, showParticles: false });
        regenCooldown.add(player.id);

        system.runTimeout(() => {
            regenCooldown.delete(player.id);
        }, 100);
    }
}
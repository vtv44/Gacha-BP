import { tickSkillBase } from "../skillBase";

export class superRegenerationChestPlateSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§dスーパーリジェネレーションチェストプレート";
    }

    equip(player) {
        player.addEffect("regeneration", 2 * 20, { amplifier: 1, showParticles: false });
    }
}
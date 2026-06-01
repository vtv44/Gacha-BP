import { tickSkillBase } from "../skillBase";

export class regenerationChestPlateSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§1リジェネレーションチェストプレート";
    }

    equip(player) {
        player.addEffect("regeneration", 2 * 20, { amplifier: 0, showParticles: false });
    }
}
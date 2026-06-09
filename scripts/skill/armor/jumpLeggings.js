import { tickSkillBase } from "../skillBase";

export class jumpLeggingsSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§1ジャンプレギンス";
    }

    equip(player) {
        if (!this.canAddEffect(player)) return;
        player.addEffect("jump_boost", 40, { amplifier: 0, showParticles: false });
    }
}
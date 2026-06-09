import { tickSkillBase } from "../skillBase";

export class superSpeedBootsSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§dスーパースピードブーツ";
    }

    equip(player) {
        if (!this.canAddEffect(player)) return;
        player.addEffect("speed", 20, { amplifier: 4, showParticles: false });
    }
}
import { tickSkillBase } from "../skillBase";

export class superSpeedBootsSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§dスーパースピードブーツ";
    }

    equip(player) {
        player.addEffect("speed", 20, { amplifier: 4, showParticles: false });
    }
}
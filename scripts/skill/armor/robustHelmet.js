import { tickSkillBase } from "../skillBase";

export class robustHelmetSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§f堅牢の頭";
    }

    equip(player) {
        if (player.isSneaking) {
            player.addEffect("resistance", 10, { amplifier: 0, showParticles: false });
        }
    }
}
import { tickSkillBase } from "../skillBase";

export class cookieArmorSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§6クッキーアーマー";
    }

    equip(player) {
        player.runCommand("effect saturation 255 5 true");
    }
}
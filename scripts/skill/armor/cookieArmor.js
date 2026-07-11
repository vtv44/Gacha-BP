import { tickSkillBase } from "../skillBase";

export class cookieArmorSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§6クッキーアーマー";
    }

    equip(player) {
        player.runCommand("saturation 255 10 true");
    }
}
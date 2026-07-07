import { skillBase } from "../skillBase";

export class wheatArmorSkill extends skillBase {
    constructor() {
        super();
        this.id = "§a麦麦アーマー";
        this.cooldown = 0;
    }

    equip(player) {
        player.addEffect("saturation", 3, { amplifier: 0, showParticles: false });
    }
}
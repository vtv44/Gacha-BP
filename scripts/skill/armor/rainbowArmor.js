import { system } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class rainbowArmorSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§eプリズムアーマー";
    }

    equip(player) {
        if (!this.canAddEffect(player)) return;

        player.addEffect("speed", 100, { amplifier: 3, showParticles: false });
        player.addEffect("strength", 100, { amplifier: 0, showParticles: false });
        player.addEffect("jump_boost", 100, { amplifier: 3, showParticles: false });
    }
}
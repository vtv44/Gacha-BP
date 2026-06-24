import { world } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class sneakSpeedLeggingsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§1スニーク加速レギンス"
    }

    equip(player) {
        if (!this.canAddEffect(player) || !player.isSneaking) return;
        player.addEffect("speed", 6, {amplifier: 7})
    }
}
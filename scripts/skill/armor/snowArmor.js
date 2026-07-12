import { system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class snowArmorSkill extends skillBase {
    constructor() {
        super();
        this.id = "§wスノーアーマー";
        this.cooldown = 0;
    }
    onDamage(player, event) {
        const target = event.hurtEntity;

        if (target && target.isValid) {
            target.addEffect("slowness", 60, { amplifier: 1 });
        }
    }
}
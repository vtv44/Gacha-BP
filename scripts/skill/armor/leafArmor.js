import { system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class leafArmorSkill extends skillBase {
    constructor() {
        super();
        this.id = "§aリーフアーマー";
        this.cooldown = 0;
    }

    onDamage(player, event) {
        const target = event.hurtEntity;

        if (target && target.isValid) {
            const dx = target.location.x - player.location.x;
            const dz = target.location.z - player.location.z;

            target.applyKnockback(dx, dz, 0.2, 1.0); 
        }
    }
}
import { system, EntityDamageCause } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";
import { CooldownManager } from "../cooldownManager";

export class soundArmorSkill extends tickSkillBase {
    constructor() {
        super()
        this.id = "§4ピアノ"
        this.cooldown = 200
    }

    equip(player) {
        if (CooldownManager.has(player, this.id)) return;
        CooldownManager.set(player, this.id, this.cooldown);

        const pos = player.location;
        const dimension = player.dimension;

        dimension.playSound("custom.sound_atk", pos);

        let count = 0;
        const intervalId = system.runInterval(() => {
            if (count >= 15) {
                system.clearRun(intervalId);
                return;
            }

            if (!player.isValid) {
                system.clearRun(intervalId);
                return;
            }

            const currentPos = player.location;
            dimension.spawnParticle("rca:note_rainbow", { x: currentPos.x, y: currentPos.y + 1, z: currentPos.z });
            dimension.spawnParticle("ptl:meteor_fall_3_purple", { x: currentPos.x, y: currentPos.y + 1, z: currentPos.z });

            const targets = this.getTargets(player, currentPos, 6);
            for (const target of targets) {
                target.applyDamage(1, { cause: EntityDamageCause.selfDestruct });
            }

            count++;
        }, 2);
    }
}

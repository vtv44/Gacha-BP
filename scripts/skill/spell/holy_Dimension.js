import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class holyDimensionSkill extends skillBase {
    constructor() {
        super();
        this.id = "§5ホーリーディメンション";
        this.cooldown = 20 * 20;
    }

    execute(player) {
        const dimension = player.dimension;

        const targets = this.getTargets(player, player.location, 5);

        for (const target of targets) {
            const pos = target.location;

            dimension.spawnParticle("rpg:yellow_magic_circle", pos);

            system.runTimeout(() => {
                if (!target.isValid) return;

                target.applyDamage(20);
                dimension.spawnParticle("ptl:golden_ambition", pos);
                dimension.spawnParticle("ptl:golden_burn", { x: pos.x, y: pos.y + 25, z: pos.z });
                dimension.spawnParticle("ptl:golden_burn", { x: pos.x, y: pos.y + 25, z: pos.z });
                dimension.spawnParticle("ptl:golden_burn", { x: pos.x, y: pos.y + 25, z: pos.z });
                player.runCommand(`playsound item.trident.thunder @a ~ ~ ~ 1 1`);
            }, 20);
        }

        this.onCooldown(player);
    }
}
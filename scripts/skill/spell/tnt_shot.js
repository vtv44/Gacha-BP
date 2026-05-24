import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class tntshotSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1TNTショット";
        this.cooldown = 1 * 20;
    }

    execute(player) {
        const dimension = player.dimension;
        const pos = player.location;
        const viewDir = player.getViewDirection();

        const spawnPos = {
            x: pos.x + viewDir.x * 2,
            y: pos.y + 1,
            z: pos.z + viewDir.z * 2
        };

        const tnt = dimension.spawnEntity("minecraft:tnt", spawnPos);

        system.runTimeout(() => {
            if (!tnt.isValid) return;
            tnt.applyImpulse({
                x: viewDir.x * 3,
                y: viewDir.y * 3,
                z: viewDir.z * 3
                            });
                        }, 1);

        this.onCooldown(player);
    }
}
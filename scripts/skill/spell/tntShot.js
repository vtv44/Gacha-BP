import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class tntShotSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1TNTショット";
        this.cooldown = 5 * 20;
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
                x: viewDir.x * 1,
                y: viewDir.y * 1,
                z: viewDir.z * 1
                            });
                        }, 1);

        this.onCooldown(player);
    }
}
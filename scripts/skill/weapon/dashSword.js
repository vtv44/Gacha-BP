import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class dashSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§a疾風の剣";
        this.cooldown = 1 * 20;
    }

    execute(player) {
        const dir = player.getViewDirection();
        const dimension = player.dimension;

        player.applyKnockback(
            { x: dir.x * 2.0, z: dir.z * 2.0 },
            0.3
        );
        player.runCommand("playsound item.trident.riptide_1 @a ~ ~ ~ 5 1");
        player.runCommand("particle minecraft:large_explosion ~ ~0.7 ~");

        const hitEntities = new Set();
        let elapsed = 0;

        const interval = system.runInterval(() => {
            elapsed++;
            if (elapsed > 10) {
                system.clearRun(interval);
                return;
            }

            const targets = this.getTargets(player, player.location, 3);

            for (const target of targets) {
                if (hitEntities.has(target.id)) continue;
                hitEntities.add(target.id);

                if (!target.isValid) continue;
                target.applyDamage(5);
                dimension.spawnParticle("rca:sweep_white", {
                    x: target.location.x,
                    y: target.location.y + 1,
                    z: target.location.z
                });
                player.runCommand("playsound random.anvil_land @s ~ ~ ~ 1 2.5");
            }
        }, 1);

        this.onCooldown(player);
    }
}
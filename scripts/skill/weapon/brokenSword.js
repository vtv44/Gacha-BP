import { skillBase } from "../skillBase";
import { EntityDamageCause } from "@minecraft/server";

export class brokenSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§a壊れた星輝剣";
        this.cooldown = 10 * 20;
    }

    execute(player) {
        if (!this.canUse(player)) return;
        this.onCooldown(player);

        const dimension = player.dimension;
        const viewDir = player.getViewDirection();
        const loc = player.location;

        const particleLoc = {
            x: loc.x + viewDir.x * 2,
            y: loc.y + viewDir.y * 2 + 1.6,
            z: loc.z + viewDir.z * 2,
        };
        dimension.spawnParticle("rca:sweep_white", particleLoc);

        dimension.playSound("random.anvil_land", loc, { volume: 1.0, pitch: 1.0 });


        const targets = this.getTargets(player, particleLoc, 3);
        for (const target of targets) {

            target.applyDamage(1, { cause: EntityDamageCause.none });


            target.applyKnockback(
                { x: viewDir.x, z: viewDir.z },
                0.5
            );
        }
    }
}
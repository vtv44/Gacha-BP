import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class healBookSkill extends skillBase {
    constructor() {
        super();
        this.id = "§a回復の本";
        this.cooldown = 20 * 1;
    }

    execute(player) {
        const dimension = player.dimension;
        const location = player.location;
        const { x, y, z } = location;

        dimension.spawnParticle("rpg:heal_magic_circle", location);
        dimension.playSound("mob.guardian.death", location);

        system.runTimeout(() => {
            dimension.spawnParticle("rpg:enchant_text", { x, y: y + 1.2, z });
            dimension.spawnParticle("rpg:particle_effect_sphere_green", { x, y: y + 1.2, z });
            dimension.playSound("random.pop2", location);
            for (let i = 1; i <= 6; i++) {
                dimension.playSound("random.orb", location, { pitch: i / 2, volume: 0.7 });
            }

            const targets = this.getTargets(player, location, 4, 0, false);
            for (const target of targets) {
                if (!this.canAddEffect(target)) continue;
                target.addEffect("regeneration", 10 * 20, { amplifier: 1 });
            }
        }, 2 * 20);

        this.onCooldown(player);
    }
}
import { world, system } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class hyperionSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§bHyperion";
        this.cooldown = 0;
    }

    has(player) {
        player.addEffect("strength", 10, { amplifier: 149, showParticles: false });
    }

    execute(player) {
        const dimension = player.dimension;

        player.runCommand("playsound mob.zombie.remedy @a ~ ~ ~");
        dimension.spawnParticle("minecraft:witchspell_emitter", player.location);

        const viewDir = player.getViewDirection();
        const maxDist = 8;
        const step = 0.25;

        const startFeet = { ...player.location };
        let safeLoc = { ...startFeet };

        for (let d = step; d <= maxDist; d += step) {
            const feet = {
                x: startFeet.x + viewDir.x * d,
                y: startFeet.y + viewDir.y * d,
                z: startFeet.z + viewDir.z * d
            };
            const body = { x: feet.x, y: feet.y + 1, z: feet.z };

            const feetBlock = dimension.getBlock(feet);
            const bodyBlock = dimension.getBlock(body);

            if (!feetBlock?.isAir || !bodyBlock?.isAir) {
                break;
            }

            safeLoc = feet;
        }

        player.teleport(safeLoc, { dimension: dimension });

        dimension.spawnParticle("minecraft:breeze_wind_explosion_emitter", safeLoc);
        dimension.spawnParticle("ptl:spread_sparkle", safeLoc);
        player.runCommand("playsound random.explode @a ~ ~ ~");

        player.addEffect("absorption", 20000000, { amplifier: 3, showParticles: false });

        system.runTimeout(() => {
            const targets = this.getTargets(player, safeLoc, 5);
            for (const target of targets) {
                target.applyDamage(2000000, {
                    cause: "entityAttack",
                    damagingEntity: player
                });
            }
        }, 1);

        this.onCooldown(player);
    }
}
import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class cosmicMeteorSkill extends skillBase {
    constructor() {
        super();
        this.id = "§bコズミックブレード";
        this.cooldown = 20 * 1;
    }

    execute(player) {
        const dimension = player.dimension;
        const pos = player.location;

        player.runCommand("playsound xxxx @a ~ ~ ~ 1 1");
        dimension.spawnParticle("xxxx", pos);
        player.runCommand("playanimation @s xxxx");

        this.onCooldown(player);

        const crystals = [];
        for (let i = 0; i < 10; i++) {
            let spawnPos;
            let attempts = 0;

            do {
                const angle = Math.random() * Math.PI * 2;
                const radius = 3 + Math.random() * 8;
                spawnPos = {
                    x: pos.x + Math.cos(angle) * radius,
                    y: pos.y + 20 + Math.random() * 10,
                    z: pos.z + Math.sin(angle) * radius
                };
                attempts++;
            } while (attempts < 10);

            const crystal = dimension.spawnEntity("gacha:purple_crystal", spawnPos);
            crystals.push(crystal);
            system.runTimeout(() => {
                if (!crystal.isValid) return;
                crystal.applyImpulse({ x: 0, y: -1, z: 0 });
            }, 2);
        }

        let tickCount = 0;
        const intervalId = system.runInterval(() => {
            tickCount++;

            for (const crystal of crystals) {
                if (!crystal.isValid) continue;

                const crystalPos = crystal.location;

                for (let dx = -1; dx <= 1; dx++) {
                for (let dz = -1; dz <= 1; dz++) {
                for (let dy = 0; dy >= -3; dy--) {
                const belowPos = {
                x: Math.floor(crystalPos.x) + dx,
                y: Math.floor(crystalPos.y) + dy,
                z: Math.floor(crystalPos.z) + dz
            };
            dimension.runCommand(`setblock ${belowPos.x} ${belowPos.y} ${belowPos.z} air`);
        }
    }
}

                const targets = this.getTargets(player, crystalPos, 1);
                for (const target of targets) {
                    target.applyDamage(15);
                }
            }

            if (tickCount >= 40) {
                system.clearRun(intervalId);
                for (const crystal of crystals) {
                    if (!crystal.isValid) continue;
                    crystal.remove();
                }
            }
        }, 1);
    }
}
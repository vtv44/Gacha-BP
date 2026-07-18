import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class campfireHealSkill extends skillBase {
    constructor() {
        super();
        this.id = "§d癒しの焚火";
        this.cooldown = 10 * 20;
    }

    execute(player) {
        const dimension = player.dimension;
        const blockHit = player.getBlockFromViewDirection({ maxDistance: 10 });
        if (!blockHit) return;

        const targetPos = {
            x: blockHit.block.location.x,
            y: blockHit.block.location.y + 1,
            z: blockHit.block.location.z
        };

        const targetBlock = dimension.getBlock(targetPos);
        if (!targetBlock || targetBlock.typeId !== "minecraft:air") {
            player.sendMessage("§cここには設置できません。");
            return;
        }

        dimension.runCommand(`setblock ${targetPos.x} ${targetPos.y} ${targetPos.z} minecraft:campfire`);

        const particlePos = {
            x: targetPos.x + 0.5,
            y: targetPos.y,
            z: targetPos.z + 0.5
        };

        let totalTick = 0;
        let stopped = false;

        const watchId = system.runInterval(() => {
            try {
                const block = dimension.getBlock(targetPos);
                if (!block || block.typeId !== "minecraft:campfire") {
                    if (!stopped) {
                        stopped = true;
                        system.clearRun(watchId);
                        dimension.runCommand(`playsound mob.zombie.woodbreak @a ${targetPos.x} ${targetPos.y} ${targetPos.z}`);
                        try {
                            dimension.spawnParticle("minecraft:wind_explosion_emitter", particlePos);
                        } catch {}
                    }
                }
            } catch {}
        }, 20);

        const heal = () => {
            if (stopped) return;

            totalTick += 100;

            if (totalTick >= 540) {
                stopped = true;
                system.clearRun(watchId);
                dimension.runCommand(`playsound mob.zombie.woodbreak @a ${targetPos.x} ${targetPos.y} ${targetPos.z}`);
                try {
                    dimension.spawnParticle("minecraft:wind_explosion_emitter", particlePos);
                } catch {}
                dimension.runCommand(`setblock ${targetPos.x} ${targetPos.y} ${targetPos.z} air`);
                return;
            }

            try {
                dimension.spawnParticle("rpg:pink_magic_circle", particlePos);
            } catch {}

            system.runTimeout(() => {
                if (stopped) return;

                const targets = dimension.getPlayers({
                    location: targetPos,
                    maxDistance: 3
                });
                for (const target of targets) {
                    target.addEffect("regeneration", 10 * 20, { amplifier: 0, showParticles: false });
                    target.addEffect("instant_health", 1, { amplifier: 0, showParticles: false });
                    try {
                        dimension.spawnParticle("rca:plus", target.location);
                    } catch {}
                }

                if (totalTick + 100 < 500) {
                    try {
                        dimension.spawnParticle("rpg:pink_magic_circle", particlePos);
                    } catch {}
                }
                dimension.runCommand(`playsound respawn_anchor.charge @a ${targetPos.x} ${targetPos.y} ${targetPos.z} 1 2`);
                try {
                    dimension.spawnParticle("rpg:particle_effect_sphere_green", particlePos);
                } catch {}

                heal();
            }, 60);
        };

        heal();
        this.onCooldown(player);
    }
}
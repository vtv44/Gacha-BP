import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class giantSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§6ジャイアントソード";
        this.cooldown = 20 * 20;
    }

    execute(player) {
        const dimension = player.dimension;
        const teamObjective = world.scoreboard.getObjective("team");
        const teamScore = teamObjective ? teamObjective.getScore(player) ?? -1 : -1;

        const viewDir = player.getViewDirection();
        const pos = player.location;

        const spawnPos = {
            x: pos.x + viewDir.x * 8,
            y: pos.y + viewDir.y * 8 + 20,
            z: pos.z + viewDir.z * 8
        };

        const sword = dimension.spawnEntity("gacha:giant_ironsword", spawnPos);

        sword.applyKnockback({x: 0, z: 0}, -3);

        let prevY = spawnPos.y;
        let tickCount = 0;
        const maxTicks = 200;

        const checkId = system.runInterval(() => {
            tickCount++;

            if (!sword.isValid || tickCount > maxTicks) {
                system.clearRun(checkId);
                return;
            }

            const currentY = sword.location.y;

            if (tickCount > 5 && Math.abs(currentY - prevY) < 0.01) {
                system.clearRun(checkId);

                const landPos = sword.location;

                dimension.runCommand(`particle minecraft:huge_explosion_emitter ${landPos.x} ${landPos.y} ${landPos.z}`)
                dimension.runCommand(`playsound random.explode @a ${landPos.x} ${landPos.y} ${landPos.z}`)


                const targets = dimension.getEntities({
                    location: landPos,
                    maxDistance: 6,
                    type: "minecraft:player",
                    ...(teamScore !== -1 ? {
                        scoreOptions: [{
                            objective: "team",
                            minScore: teamScore,
                            maxScore: teamScore,
                            exclude: true
                        }]
                    } : {})
                });

                for (const target of targets) {
                    target.applyDamage(10);
                }

                sword.remove();
            }

            prevY = currentY;
        }, 1);

        this.onCooldown(player);
    }
}
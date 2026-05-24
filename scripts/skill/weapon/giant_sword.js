import { world, system, Effect } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class giantSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§6ジャイアントソード";
        this.cooldown = 1 * 1;
    }

    execute(player) {
        const dimension = player.dimension;
        const teamObjective = world.scoreboard.getObjective("team");
        const teamScore = teamObjective ? teamObjective.getScore(player) ?? -1 : -1;

        const viewDir = player.getViewDirection();
        const pos = player.location;

        const spawnPos = {
            x: pos.x + viewDir.x * 10,
            y: pos.y + viewDir.y * 10 + 50,
            z: pos.z + viewDir.z * 10
        };

        const sword = dimension.spawnEntity("gacha:giant_ironsword", spawnPos);

        system.runTimeout(() => {
        if (!sword.isValid) return;
        sword.applyImpulse({ x: 0, y: -500, z: 0 });
        }, 2);

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

                system.runTimeout(() => {
                    dimension.runCommand(`particle ptl:fire_scatter ${landPos.x} ${landPos.y} ${landPos.z}`)
                    dimension.runCommand(`playsound random.anvil_land @a ${landPos.x} ${landPos.y} ${landPos.z}`)

                    const targets = dimension.getEntities({
                        location: landPos,
                        maxDistance: 4.0,
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
                        target.applyDamage(5);
                    }

                    sword.remove();
                }, 5);
            }

            prevY = currentY;
        }, 1);

        this.onCooldown(player);
    }
}
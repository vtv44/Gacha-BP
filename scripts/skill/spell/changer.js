import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class changerSkill extends skillBase {
    constructor() {
        super();
        this.id = "§6チェンジャー";
        this.cooldown = 1 * 20;
        this.TEAM_OBJECTIVE = "team"; // ここを実際のスコアボード名に変更してください
    }

    execute(player) {
        player.runCommand("playsound random.bow @a ~ ~ ~ 1 1");

        const viewDir = player.getViewDirection();
        const headPos = player.getHeadLocation();

        const projectile = player.dimension.spawnEntity("gacha:changer", headPos);
        projectile.addTag("is_projectile");
        projectile.setDynamicProperty("ownerId", player.id);
        projectile.setDynamicProperty("dirX", viewDir.x);
        projectile.setDynamicProperty("dirY", viewDir.y);
        projectile.setDynamicProperty("dirZ", viewDir.z);

        this.startProjectileTracking(projectile, player);
        this.onCooldown(player);
    }

    startProjectileTracking(projectile, owner) {
        const MAX_LOOPS = 20; // 2tickごと * 30 = 約3秒
        const SPEED = 3.0;
        let loops = 0;

        const interval = system.runInterval(() => {
            loops++;

            if (!projectile || !projectile.isValid) { 
                system.clearRun(interval); 
                return; 
            }

            if (loops >= MAX_LOOPS) {
                if (projectile.isValid) projectile.remove();
                system.clearRun(interval);
                return;
            }

            const currentPos = projectile.location;
            const dx = projectile.getDynamicProperty("dirX");
            const dy = projectile.getDynamicProperty("dirY");
            const dz = projectile.getDynamicProperty("dirZ");

            const nextPos = {
                x: currentPos.x + (dx * SPEED),
                y: currentPos.y + (dy * SPEED),
                z: currentPos.z + (dz * SPEED)
            };
            projectile.teleport(nextPos);

            const hitCandidates = projectile.dimension.getEntities({
                location: nextPos,
                maxDistance: 2.0,
                excludeEntities: [projectile, owner]
            });

            let ownerScore = null;
            try {
                const obj = world.scoreboard.getObjective(this.TEAM_OBJECTIVE);
                ownerScore = obj.getScore(owner);
            } catch (e) {}

            for (const target of hitCandidates) {
                if (!target || !target.isValid || target.id === owner.id || target.hasTag("is_projectile")) continue;
                if (target.typeId !== "minecraft:player") continue;

                if (ownerScore !== null) {
                    try {
                        const obj = world.scoreboard.getObjective(this.TEAM_OBJECTIVE);
                        const targetScore = obj.getScore(target);
                        if (targetScore === ownerScore) continue;
                    } catch (e) {}
                }

                const box = this.getEntityHitbox(target);
                const w = box.width / 2;
                const tLoc = target.location;
                const targetCenter = { x: tLoc.x, y: tLoc.y + (box.height / 2), z: tLoc.z };

                if (this.getDistanceFromPointToSegment(targetCenter, currentPos, nextPos) < (0.8 + w)) {
                    const ownerLoc = owner.location;
                    const targetLoc = tLoc;

                    target.teleport(ownerLoc);
                    owner.teleport(targetLoc);

                    target.dimension.playSound("mob.endermen.portal", targetLoc);
                    owner.dimension.playSound("mob.endermen.portal", ownerLoc);

                    projectile.remove();
                    system.clearRun(interval);
                    return;
                }
            }
        }, 1);
    }

    getEntityHitbox(target) {
        return { width: 0.6, height: 1.8 };
    }

    getDistanceFromPointToSegment(p, a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const l2 = dx * dx + dy * dy + dz * dz;
        if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y, p.z - a.z);
        let t = ((p.x - a.x) * dx + (p.y - a.y) * dy + (p.z - a.z) * dz) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy), p.z - (a.z + t * dz));
    }
}
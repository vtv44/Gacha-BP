import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class highGearSkill extends skillBase {
    constructor() {
        super();
        this.id = "§bハイギア";
        this.cooldown = 7 * 20;
    }

    execute(player) {
        const dir = player.getViewDirection();
        player.applyKnockback({ x: dir.x * 10, z: dir.z * 10 }, -1);

        player.runCommand("/playsound item.trident.riptide_3 @a ~ ~ ~ 1 2");
        player.runCommand("particle rca:lightning_large_blue ~ ~ ~");

        this.onCooldown(player);
    }
}

const jumpCooldown = new Set();
const isJumpingMap = new Set();

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const held = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
        if (held?.nameTag !== "§bハイギア") {
            isJumpingMap.delete(player.id);
            continue;
        }

        player.addEffect("speed", 10, { amplifier: 6, showParticles: false });

        const vel = player.getVelocity();
        const isMoving = Math.abs(vel.x) > 0.7 || Math.abs(vel.z) > 0.7;
        if (isMoving) {
            const pos = player.location;
            const viewDir = player.getViewDirection();
            player.runCommand(`particle rca:afterimage ${pos.x - viewDir.x} ${pos.y} ${pos.z - viewDir.z}`);
            player.runCommand("playsound mob.endermen.portal @a ~ ~ ~");
        }

        if (player.isJumping && vel.y > 0 && vel.y < 0.5 && !jumpCooldown.has(player.id)) {
            jumpCooldown.add(player.id);

            system.runTimeout(() => {
                isJumpingMap.add(player.id);
            }, 2);

            system.runTimeout(() => {
                isJumpingMap.delete(player.id);
            }, 10);

            system.runTimeout(() => {
                jumpCooldown.delete(player.id);
            }, 5);
        }

        if (isJumpingMap.has(player.id) && system.currentTick % 1 === 0) {
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 1.4, z: dir.z * 1.4 }, 0);
        }
    }
}, 1);
import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class gyroKineticWandSkill extends skillBase {
    constructor() {
        super();
        this.id = "§5ジャイロキネティックワンド";
        this.cooldown = 15 * 20;
    }

    execute(player) {
        const blockHit = player.getBlockFromViewDirection({ maxDistance: 20 });
        if (!blockHit) return;

        const center = blockHit.block.location;
        const dimension = player.dimension;

        // 音を2tick間隔で200tick分
        for (let i = 0; i < 100; i++) {
            system.runTimeout(() => {
                dimension.runCommand(`playsound item.trident.riptide_2 @a ${Math.floor(center.x)} ${Math.floor(center.y)} ${Math.floor(center.z)}`);
            }, i * 2);
        }

        // パーティクルを円を描きながら200tickで収束（5tick間隔）
        let angle = 0;
        let particleCount = 0;
        const particleId = system.runInterval(() => {
            particleCount++;
            if (particleCount > 100) { // 2tick * 100 = 200tick
                system.clearRun(particleId);
                return;
            }

            const radius = Math.max(0, 10 * (1 - particleCount / 100));
            angle += 0.3;

            const x = center.x + Math.cos(angle) * radius;
            const y = center.y + 1;
            const z = center.z + Math.sin(angle) * radius;

            dimension.runCommand(`particle minecraft:witchspell_emitter ${Math.floor(x * 100) / 100} ${Math.floor(y * 100) / 100} ${Math.floor(z * 100) / 100}`);
        }, 2);

        // 吸い込み処理
        let tickCount = 0;
        const duration = 200;

        const intervalId = system.runInterval(() => {
            tickCount++;
            if (tickCount > duration) {
                system.clearRun(intervalId);
                return;
            }

            const targets = this.getTargets(player, center, 10);
            for (const target of targets) {
                if (!target.isValid) continue;
                const loc = target.location;
                const dx = center.x - loc.x;
                const dy = center.y - loc.y;
                const dz = center.z - loc.z;
                const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
                target.applyKnockback({ x: dx / len, z: dz / len }, dy / len);
            }

            const entities = dimension.getEntities({
                location: center,
                maxDistance: 10,
                excludeTypes: ["minecraft:player"]
            });
            for (const entity of entities) {
                if (!entity.isValid) continue;
                const loc = entity.location;
                const dx = center.x - loc.x;
                const dy = center.y - loc.y;
                const dz = center.z - loc.z;
                const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
                entity.applyImpulse({ x: dx / len * 0.3, y: dy / len * 0.3, z: dz / len * 0.3 });
            }
        }, 1);

        this.onCooldown(player);
    }
}
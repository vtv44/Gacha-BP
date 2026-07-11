import { skillBase } from "../skillBase";

export class endstoneSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§eエンドストーンソード";
        this.cooldown = 100;
    }

    execute(player, event) {
        this.onCooldown(player);

        const viewDir = player.getViewDirection();
        const dimension = player.dimension;
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
                break; // ここでsafeLocは更新しない = 1つ前の安全地点で止まる
            }

            safeLoc = feet;
        }

        player.teleport(safeLoc, { dimension: dimension });

        player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.0 });
        player.dimension.spawnParticle("minecraft:witchspell_emitter", player.location);
    }
}
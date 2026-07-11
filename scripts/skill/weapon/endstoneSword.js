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
        const step = 0.25; // 判定の細かさ(小さいほど正確だが処理が増える)

        const headLoc = {
            x: player.location.x,
            y: player.location.y + 1.62,
            z: player.location.z
        };

        let safeLoc = { ...player.location }; // 最後に安全だった座標(足元基準)

        for (let d = step; d <= maxDist; d += step) {
            const checkHead = {
                x: headLoc.x + viewDir.x * d,
                y: headLoc.y + viewDir.y * d,
                z: headLoc.z + viewDir.z * d
            };

            // 足元(プレイヤーの立ち位置基準)も同時にチェック
            const checkFeet = {
                x: checkHead.x,
                y: checkHead.y - 1.62,
                z: checkHead.z
            };
            const checkBody = {
                x: checkHead.x,
                y: checkHead.y - 0.9,
                z: checkHead.z
            };

            const headBlock = dimension.getBlock(checkHead);
            const bodyBlock = dimension.getBlock(checkBody);
            const feetBlock = dimension.getBlock(checkFeet);

            // どこか1点でも埋まっていたら、そこで打ち切り
            if (
                !headBlock?.isAir ||
                !bodyBlock?.isAir ||
                !feetBlock?.isAir
            ) {
                break;
            }

            safeLoc = checkFeet;
        }

        player.teleport(safeLoc, { dimension: dimension });

        player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.0 });
        player.dimension.spawnParticle("minecraft:witchspell_emitter", player.location);
    }
}
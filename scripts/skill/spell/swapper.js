import { skillBase } from "../skillBase";

export class swapperSkill extends skillBase {
    constructor() {
        super();
        this.id = "§6スワッパー"; // ※元のID（スワッパー等）に合わせて変更してください
        this.cooldown = 20 * 15; 
    }

    execute(player) {
        // ▼ 追加: 空中にいる（地面に足がついていない）場合は不発にする
        if (!player.isOnGround) {
            player.onScreenDisplay.setActionBar("§c空中では使用できません");
            return;
        }

        const maxDistance = 30; 

        // 1. 視線の先にある一番手前のブロックを取得
        const blockHit = player.getBlockFromViewDirection({ maxDistance: maxDistance });
        let blockDistance = maxDistance + 1;

        if (blockHit && blockHit.faceLocation) {
            const headLoc = player.getHeadLocation();
            const faceLoc = blockHit.faceLocation;
            blockDistance = Math.sqrt(
                Math.pow(headLoc.x - faceLoc.x, 2) +
                Math.pow(headLoc.y - faceLoc.y, 2) +
                Math.pow(headLoc.z - faceLoc.z, 2)
            );
        }

        // 2. 視線の先にあるエンティティ（プレイヤー）を取得
        const entities = player.getEntitiesFromViewDirection({ maxDistance: maxDistance });
        let targetPlayer = null;

        for (const hit of entities) {
            const entity = hit.entity;

            if (entity.id !== player.id && entity.typeId === "minecraft:player") {
                if (hit.distance > blockDistance) {
                    break;
                }
                targetPlayer = entity;
                break;
            }
        }

        // 3. ターゲットが見つからなかった場合はスキル不発
        if (!targetPlayer) {
            player.onScreenDisplay.setActionBar("§c有効なターゲットが見つかりません");
            return;
        }

        // 4. 入れ替え処理
        const playerLoc = player.location;
        const targetLoc = targetPlayer.location;

        player.teleport(targetLoc);
        targetPlayer.teleport(playerLoc);

        player.dimension.playSound("mob.endermen.portal", playerLoc, { volume: 1.0, pitch: 1.0 });
        player.dimension.playSound("mob.endermen.portal", targetLoc, { volume: 1.0, pitch: 1.0 });

        player.sendMessage("§6[スキル] §e対象と位置を入れ替えました！");
        targetPlayer.sendMessage("§6[スキル] §c能力によって位置を入れ替えられました！");

        // 5. 成功した時のみクールタイムを発生させる
        this.onCooldown(player);
    }
}
import { world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class trueAssassinBladeSkill extends skillBase {
    static recordedTargets = new Map();

    constructor() {
        super();
        this.id = "§bアサシンブレード =極=";
        this.cooldown = 0; // クールタイム0

        world.afterEvents.entityDie.subscribe((event) => {
            const deadEntity = event.deadEntity;
            
            for (const [playerId, target] of trueAssassinBladeSkill.recordedTargets.entries()) {
                if (target && target.id === deadEntity.id) {
                    // 死んだので記録を削除
                    trueAssassinBladeSkill.recordedTargets.delete(playerId);
                    
                    // 記録していたプレイヤーにお知らせする（親切設計）
                    const p = world.getAllPlayers().find(p => p.id === playerId);
                    if (p) {
                        p.sendMessage("§8マーキング対象が死亡したため、記録が解除されました。");
                    }
                }
            }
        });
    }

    use(player, event) {
        if (player.isSneaking) {
            if (trueAssassinBladeSkill.recordedTargets.has(player.id)) {
                trueAssassinBladeSkill.recordedTargets.delete(player.id);
                player.sendMessage("§7マーキングを解除しました。");
                player.dimension.playSound("random.click", player.location);
            } else {
                player.onScreenDisplay.setActionBar("§c記録されている対象がいません");
            }
            return;
        }

        super.use(player, event);
    }

    onDamage(player, event) {
        if (trueAssassinBladeSkill.recordedTargets.has(player.id)) {
            return;
        }

        const target = event.hurtEntity || event.hitEntity;

        if (target) {
            trueAssassinBladeSkill.recordedTargets.set(player.id, target);
            
            const targetName = target.nameTag || target.name || "エンティティ";
            player.sendMessage(`§e対象(${targetName})をマーキングしました！\n§7※スニーク右クリックで解除`);
            player.dimension.playSound("random.orb", player.location, { volume: 1.0, pitch: 2.0 });
        }
    }

    execute(player) {
        const target = trueAssassinBladeSkill.recordedTargets.get(player.id);

        if (!target) {
            player.onScreenDisplay.setActionBar("§c有効なターゲットが記録されていません");
            return;
        }

        // 発動時に対象の体力を確認し、死んでいないかチェックする
        const health = target.getComponent("health");
        if (health && health.currentValue <= 0) {
            player.onScreenDisplay.setActionBar("§c対象は既に死亡しています");
            trueAssassinBladeSkill.recordedTargets.delete(player.id);
            return;
        }

        // try-catch で囲むことで、相手がログアウト等で消えていた時のエラー落ちを完全に防ぐ
        try {
            const targetLoc = target.location;
            const viewDir = target.getViewDirection(); 

            const tpX = targetLoc.x - (viewDir.x * 2);
            const tpY = targetLoc.y; 
            const tpZ = targetLoc.z - (viewDir.z * 2);

            const aimLoc = { x: targetLoc.x, y: targetLoc.y + 0.1, z: targetLoc.z };

            player.teleport({ x: tpX, y: tpY, z: tpZ }, {
                dimension: target.dimension,
                facingLocation: aimLoc 
            });

            player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.5 });
            player.sendMessage("§c対象の背後に奇襲しました！");

            this.onCooldown(player);

        } catch (error) {
            // 対象が世界から消えていてエラーになった場合は、記録を消して安全に終了する
            player.onScreenDisplay.setActionBar("§c対象を見失いました");
            trueAssassinBladeSkill.recordedTargets.delete(player.id);
        }
    }
}
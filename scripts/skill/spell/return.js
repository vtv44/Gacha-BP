import { system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { CooldownManager } from "../cooldownManager"; // 追加: クールタイム管理用

export class returnSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1リターン";
        this.cooldown = 30 * 20;
    }

        execute(player) {
        const lastTick = player.getDynamicProperty("returnLastTick") ?? 0;
        const currentTick = system.currentTick;

        if (lastTick !== 0 && currentTick - lastTick < 400) {
            const x = player.getDynamicProperty("returnX");
            const y = player.getDynamicProperty("returnY");
            const z = player.getDynamicProperty("returnZ");

            player.teleport({ x, y, z }, { dimension: player.dimension });
            player.dimension.playSound("random.orb", { x, y, z });
            player.sendMessage("§b元の場所に戻りました。");
            
            player.setDynamicProperty("returnLastTick", 0);
            this.onCooldown(player); // 戻る時だけクールダウン
        } else {
            const pos = player.location;
            player.setDynamicProperty("returnX", pos.x);
            player.setDynamicProperty("returnY", pos.y);
            player.setDynamicProperty("returnZ", pos.z);
            player.setDynamicProperty("returnLastTick", currentTick);

            player.dimension.playSound("respawn.anchor.charge", pos);
            player.sendMessage("§d座標を記録しました。");
            // クールダウンなし
        }
    }
}

// 監視ループ
const skillInstance = new returnSkill(); // クールタイム付与のためにインスタンスを作成

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const lastTick = player.getDynamicProperty("returnLastTick") ?? 0;

        // 所持チェック
        const held = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
        const isHolding = held?.nameTag === "§1リターン";

        if (lastTick === 0) {
            if (isHolding) {
                player.onScreenDisplay.setActionBar("§d座標未記録");
            }
            continue;
        }

        if (system.currentTick - lastTick >= 400) {
            player.setDynamicProperty("returnLastTick", 0);
            player.sendMessage("§c記録された座標の制限時間が経過し、消滅しました。");
            CooldownManager.set(player, "§1リターン", 10 * 20);
            continue;
        }

        if (isHolding) {
            const remaining = Math.ceil((400 - (system.currentTick - lastTick)) / 20);
            player.onScreenDisplay.setActionBar(`§d座標記録中: §f残り${remaining}秒`);
        }

        const x = player.getDynamicProperty("returnX");
        const y = player.getDynamicProperty("returnY");
        const z = player.getDynamicProperty("returnZ");

        if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
            player.dimension.spawnParticle("return_particle", { x: x, y: y - 0.4, z: z });
        }
    }
}, 20);
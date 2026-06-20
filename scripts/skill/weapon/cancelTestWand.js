import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class cancelTestWandSkill extends skillBase {
    constructor() {
        super();
        this.id = "a";
        this.cooldown = 5 * 20;
    }

    execute(player) {
        if (!this.canAddEffect(player)) {
            player.sendMessage("§cすでにスキルキャンセル状態です！");
            return;
        }

        this.clearEffectSetTime(player, 10 * 20);
        
        player.sendMessage("§e[検証] 10秒間、スキルキャンセル状態になりました！");
        player.dimension.playSound("note.bass", player.location, { volume: 1.0, pitch: 0.5 });

        system.runTimeout(() => {
            if (!player.isValid) return;

            player.sendMessage("§a[検証] スキルキャンセル状態が解除されました。");
            player.dimension.playSound("note.harp", player.location, { volume: 1.0, pitch: 1.5 });
            
        }, 10 * 20);

        this.onCooldown(player);
    }
}
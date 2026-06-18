import { skillBase } from "../skillBase";

export class wheatSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§5麦麦ソード";
        this.cooldown = 10 * 20; // クールダウン10秒
    }

    // 右クリックで発動：自分に saturation を付与し、メッセージを表示
    execute(player) {
        // saturation 1 255 (増幅254) を1秒間付与
        player.addEffect("saturation", 20, { amplifier: 254, showParticles: false });
        
        // メッセージを表示
        player.sendMessage("§6おいしい！");
        
        // 音のみ再生
        player.dimension.playSound("random.eat", player.location, { volume: 1.0, pitch: 1.0 });
        
        this.onCooldown(player);
    }

    // 殴った相手に saturation 1 1 を付与（ヒットエフェクトなし）
    onDamage(player, event) {
        event.hurtEntity.runCommand("effect @s saturation 1 0 true");
    }
}
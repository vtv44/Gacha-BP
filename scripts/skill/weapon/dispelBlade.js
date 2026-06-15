import { skillBase } from "../skillBase";

export class dispelBladeSkill extends skillBase {
    constructor() {
        super();
        this.id = "ディスペルブレード";
        this.cooldown = 0; // クールタイムは常にゼロ
    }

    // 敵を殴った（ダメージを与えた）時に無条件で発動
    onDamage(player, event) {
        if (!player || !player.isValid) return;

        // 殴られた対象（敵エンティティ）を取得
        const target = event.hurtEntity;
        if (!target || !target.isValid) return;

        // 3秒間（3秒 * 20 ticks = 60 ticks）
        const duration = 3 * 20; 

        // 1. バニラのコマンドで、相手の今かかっているエフェクトを即座に全消去
        target.runCommand("effect @s clear");

        // 2. 3秒間エフェクトが付かない状態にする（無条件で毎回上書き付与）
        this.clearEffectSetTime(target, duration);

        // 3. 演出（効果音をターゲットの位置で鳴らす）
        target.dimension.playSound("random.glass", target.location, { volume: 1.0, pitch: 1.5 });

        // クールダウン処理（this.onCooldown）は呼ばないことで、CTを完全に踏み倒します
    }
}
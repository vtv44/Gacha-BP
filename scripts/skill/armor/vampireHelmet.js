import { EquipmentSlot } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class vampireHelmetSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§aヴァンパイアヘルメット";
        this.cooldown = 0;
    }

    has(player) {
        if (!player || !player.isValid) return false;

        const equippable = player.getComponent("equippable");
        if (!equippable) return false;

        const headItem = equippable.getEquipment(EquipmentSlot.Head);
        
        // 頭に「§aヴァンパイアヘルメット」を被っている時だけ、このスキルを「持っている(true)」とみなす
        return headItem ? headItem.nameTag === this.id : false;
    }

    // 2. システム側で装備時に呼び出す処理（今回は常時パッシブなので空でOK）
    equip(player) {}

    // 3. has()がtrue（＝ヘルメットを被っている時）だけ、攻撃時にシステムから呼ばれる
    onDamage(player, event) {
        if (!player || !player.isValid) return;

        const healthComponent = player.getComponent("health");
        if (!healthComponent) return;

        const currentHealth = healthComponent.currentValue;
        const maxHealth = healthComponent.effectiveMaxValue;

        // 体力が減っている場合のみ、HPを1（ハート0.5個分）回復
        if (currentHealth < maxHealth) {
            healthComponent.setCurrentValue(Math.min(currentHealth + 1, maxHealth));
            
            // 吸血音の演出
            player.dimension.playSound("random.orb", player.location, { volume: 0.4, pitch: 1.8 });
        }
    }
}
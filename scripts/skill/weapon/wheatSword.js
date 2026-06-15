import { skillBase } from "../skillBase";
import { ItemStack } from "@minecraft/server";

export class wheatSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "gacha:wheat_weapon";
    }

    // 攻撃時の効果
    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target || !target.isValid) return;

        const hand = player.getComponent("equippable").getEquipment("Mainhand");
        if (!hand) return;

        if (hand.typeId === "gacha:wheat_weapon") {
            target.runCommand("effect @s saturation 1 1 true");
        } else if (hand.typeId === "gacha:deadbush_weapon") {
            target.runCommand("effect @s hunger 5 2 true");
        }
    }

    // スニーク右クリック等で発動する切り替え処理
    execute(player) {
        const equip = player.getComponent("equippable");
        const oldItem = equip.getEquipment("Mainhand");
        if (!oldItem) return;

        // 次のアイテムIDを決定
        const newTypeId = (oldItem.typeId === "gacha:wheat_weapon") ? "gacha:deadbush_weapon" : "gacha:wheat_weapon";
        const newItem = new ItemStack(newTypeId, 1);

        // --- エンチャント引き継ぎ処理 ---
        const oldEnchantable = oldItem.getComponent("minecraft:enchantable");
        if (oldEnchantable) {
            const enchantments = oldEnchantable.getEnchantments();
            const newEnchantable = newItem.getComponent("minecraft:enchantable");
            if (newEnchantable) {
                newEnchantable.setEnchantments(enchantments);
            }
        }

        // 持ち替え実行
        equip.setEquipment("Mainhand", newItem);
        player.dimension.playSound("random.click", player.location, { volume: 0.5, pitch: 1.2 });
    }
}
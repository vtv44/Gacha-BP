import { EquipmentSlot } from "@minecraft/server";
import { tickSkillBase } from "../skillBase"; // パスは環境に合わせてください

export class vampireHelmetSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§aヴァンパイアヘルメット";
        this.cooldown = 0;
    }

    onDamage(player, event) {
        const equippable = player.getComponent("equippable");
        if (!equippable) return;

        const headItem = equippable.getEquipment(EquipmentSlot.Head);

        if (headItem && headItem.nameTag === this.id) {
            const healthComponent = player.getComponent("health");
            if (healthComponent) {
                const currentHealth = healthComponent.currentValue;
                const maxHealth = healthComponent.effectiveMaxValue;

                if (currentHealth < maxHealth) {
                    healthComponent.setCurrentValue(Math.min(currentHealth + 1, maxHealth));

                    player.dimension.playSound("random.orb", player.location, { volume: 0.4, pitch: 1.8 });
                }
            }
        }
    }
}
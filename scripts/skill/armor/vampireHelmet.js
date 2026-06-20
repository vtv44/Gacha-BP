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
        
        return headItem ? headItem.nameTag === this.id : false;
    }

    equip(player) {}

    onDamage(player, event) {
        if (!player || !player.isValid) return;

        const healthComponent = player.getComponent("health");
        if (!healthComponent) return;

        const currentHealth = healthComponent.currentValue;
        const maxHealth = healthComponent.effectiveMaxValue;

        if (currentHealth < maxHealth) {
            healthComponent.setCurrentValue(Math.min(currentHealth + 1, maxHealth));
            

            player.dimension.playSound("random.orb", player.location, { volume: 0.4, pitch: 1.8 });
        }
    }
}
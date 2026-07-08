import { skillBase } from "../skillBase";

export class wheatSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1麦麦ソード";
        this.cooldown = 10 * 20;
    }

    execute(player) {
        const hunger = player.getComponent("minecraft:player.hunger");
        if (hunger) {
            const newHunger = Math.min(hunger.currentValue + 20, hunger.effectiveMax);
            hunger.setCurrentValue(newHunger);
        }
        
        player.sendMessage("§6おいしい！");
        
        player.dimension.playSound("random.eat", player.location, { volume: 1.0, pitch: 1.0 });
        
        this.onCooldown(player);
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target) return;

        const targetHunger = target.getComponent("minecraft:player.hunger");
        if (targetHunger) {
            const newHunger = Math.min(targetHunger.currentValue + 2, targetHunger.effectiveMax);
            targetHunger.setCurrentValue(newHunger);
        }
    }
}
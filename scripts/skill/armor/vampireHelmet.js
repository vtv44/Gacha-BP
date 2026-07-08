import { skillBase } from "../skillBase";

export class vampireHelmetSkill extends skillBase {
    constructor() {
        super();
        this.id = "§aヴァンパイアヘルメット";
        this.cooldown = 100;
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target) return;

        if (!this.canUse(player)) return;

        this.onCooldown(player);

        const health = player.getComponent("minecraft:health");
        if (health) {
            const healAmount = 4;

            const newHealth = Math.min(health.currentValue + healAmount, health.effectiveMax);
            
            health.setCurrentValue(newHealth);
        }

        target.dimension.playSound("mob.phantom.bite", target.location, { volume: 1.0, pitch: 1.0 });
        player.dimension.spawnParticle("minecraft:heart_particle", player.location);
    }
}
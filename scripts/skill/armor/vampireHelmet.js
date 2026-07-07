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

        this.onCooldown(player);

        player.addEffect("instant_health", 1, { amplifier: 0, showParticles: false });

        target.dimension.playSound("mob.phantom.bite", target.location, { volume: 1.0, pitch: 1.0 });

        player.dimension.spawnParticle("minecraft:heart_particle", player.location);
    }
}
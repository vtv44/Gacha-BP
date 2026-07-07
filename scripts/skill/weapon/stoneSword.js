import { skillBase } from "../skillBase";

export class stoneSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§7石の剣";
        this.cooldown = 300; 
    }

    execute(player, event) {
        this.onCooldown(player);

        player.addEffect("resistance", 100, { amplifier: 1 });

        player.dimension.playSound("your.sound.id.here", player.location, { volume: 1.0, pitch: 1.0 });
        player.dimension.spawnParticle("minecraft:your_particle_id_here", player.location);

        const targets = this.getTargets(player, player.location, 5);
        
        for (const target of targets) {
            target.applyDamage(4, { damagingEntity: player });

            const dx = target.location.x - player.location.x;
            const dz = target.location.z - player.location.z;
            const distance = Math.sqrt(dx * dx + dz * dz) || 1;

            const forceX = (dx / distance) * 2.0;
            const forceZ = (dz / distance) * 2.0;
            target.applyKnockback({ x: forceX, z: forceZ }, 0.5);
        }
    }
}
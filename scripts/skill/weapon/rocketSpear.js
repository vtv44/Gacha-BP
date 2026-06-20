import { skillBase } from "../skillBase";
import { system, EntityDamageCause, ItemStack } from "@minecraft/server";

export class rocketSpearSkill extends skillBase {
    constructor() {
        super();
        this.id = "ロケットスピア";
        this.cooldown = 10 * 20;
    }

    execute(player) {
        if (!this.canUse(player)) return;
        this.onCooldown(player);

        const dimension = player.dimension;
        const loc = player.location;
        const viewDir = player.getViewDirection();

        this.consumeItem(player);
        system.runTimeout(() => {
            const newItem = new ItemStack("minecraft:stick", 1);
            newItem.nameTag = this.id;
            player.getComponent("inventory").container.addItem(newItem);
        }, 1);

        const length = 15;
        const steps = 30; 
        const hitRadius = 1.5; 

        const hitTargets = new Set();

        for (let i = 1; i <= steps; i++) {
            const t = (i / steps) * length;

            system.runTimeout(() => {
                const particleLoc = {
                    x: loc.x + viewDir.x * t,
                    y: loc.y + viewDir.y * t + 1.6,
                    z: loc.z + viewDir.z * t,
                };

                dimension.spawnParticle("minecraft:critical_hit_emitter", particleLoc);

                const targets = this.getTargets(player, particleLoc, hitRadius);
                for (const target of targets) {
                    if (hitTargets.has(target.id)) continue;
                    hitTargets.add(target.id);
                    target.applyDamage(5, { cause: EntityDamageCause.projectile });
                }
            }, Math.floor(i * 0.5));
        }

        dimension.playSound("mob.arrow.hit_player", loc, { volume: 1.0, pitch: 0.8 });
    }
}
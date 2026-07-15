import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class curseSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§4カースソード";
        this.cooldown = 0 * 0;
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target || !target.isValid) return;

        const targets = this.getTargets(player, player.location, 20);
        if (!targets.includes(target)) return;

        const hasPoison = target.getEffect("poison");
        const hasWither = target.getEffect("wither");
        const fireTime = target.getDynamicProperty("curse_fire_time") ?? 0;
        const hasFire = system.currentTick < fireTime;

        if (hasPoison && hasWither && hasFire) {
            const blockDuration = 666 * 20;
            this.clearEffectSetTime(target, blockDuration);
            
            player.sendMessage(`§c[呪い] ${target.nameTag || target.name} のステータス効果を666秒間封印した！`);
            player.dimension.playSound("mob.wither.spawn", player.location, { volume: 0.5 });
        }

        if (this.canAddEffect(target)) {
            const roll = Math.random();
            const duration = 5 * 20;

            if (roll < 0.33) {
                target.addEffect("poison", duration, { amplifier: 1, showParticles: true });
            } else if (roll < 0.66) {
                target.addEffect("wither", duration, { amplifier: 1, showParticles: true });
            } else {
                target.setOnFire(5);
                target.setDynamicProperty("curse_fire_time", system.currentTick + duration);
            }
        }
    }
}
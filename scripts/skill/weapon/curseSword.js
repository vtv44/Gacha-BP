import { skillBase } from "../skillBase";

export class curseSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§5カースソード";
        this.cooldown = 5 * 20;
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target.isValid) return;

        const targets = this.getTargets(player, player.location, 20);
        if (!targets.includes(target)) return;

        const roll = Math.random();
        const duration = 5 * 20;

        if (roll < 0.33) {
            target.addEffect("poison", duration, { amplifier: 1, showParticles: true });
        } else if (roll < 0.66) {
            target.addEffect("wither", duration, { amplifier: 1, showParticles: true });
        } else {
            target.setOnFire(5);
        }
    }
}
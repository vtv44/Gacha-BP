import { skillBase } from "../skillBase";

export class blowAwaySwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "ふきとばソード"; 
        this.cooldown = 0; 
    }

    onDamage(player, event) {
        const target = event.hurtEntity || event.hitEntity;

        if (target) {
            
            target.applyKnockback({ x: 0, z: 0 }, 0.5);

            player.dimension.playSound("mob.enderdragon.flapan", target.location, { volume: 0.5, pitch: 1.5 });
        }
    }
}
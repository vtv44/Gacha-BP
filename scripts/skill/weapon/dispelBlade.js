import { skillBase } from "../skillBase";

export class dispelBladeSkill extends skillBase {
    constructor() {
        super();
        this.id = "ディスペルブレード";
        this.cooldown = 0;
    }

    onDamage(player, event) {
        if (!player || !player.isValid) return;

        const target = event.hurtEntity;
        if (!target || !target.isValid) return;

        const duration = 3 * 20; 

        target.runCommand("effect @s clear");


        this.clearEffectSetTime(target, duration);

        target.dimension.playSound("random.glass", target.location, { volume: 1.0, pitch: 1.5 });

    }
}
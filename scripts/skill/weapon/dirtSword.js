import { skillBase } from "../skillBase";

export class dirtSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§n土の剣";
        this.cooldown = 0;
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target || target.typeId !== "minecraft:player") return;

        const currentLoc = target.location;

        target.teleport({
            x: currentLoc.x,
            y: currentLoc.y - 1,
            z: currentLoc.z
        }, { dimension: target.dimension });

        player.dimension.playSound("dig.gravel", target.location, { volume: 1.0, pitch: 1.0 });
    }
}
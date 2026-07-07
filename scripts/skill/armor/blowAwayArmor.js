import { skillBase } from "../skillBase";

export class blowAwayArmorSkill extends skillBase {
    constructor() {
        super();
        this.id = "ふきとばアーマー";
        this.cooldown = 0;
    }

    onHurt(player, event) {
        const attacker = event.damageSource.damagingEntity;
        if (!attacker || attacker.typeId !== "minecraft:player") return;

        const loc = player.location;
        const aLoc = attacker.location;
        const dx = aLoc.x - loc.x;
        const dz = aLoc.z - loc.z;
        const len = Math.sqrt(dx * dx + dz * dz) || 1;

        attacker.applyKnockback({ x: dx / len * 1.5, z: dz / len * 1.5 }, 0.5);
        player.dimension.playSound("mob.enderdragon.flapan", aLoc, { volume: 0.5, pitch: 1.2 });
    }
}
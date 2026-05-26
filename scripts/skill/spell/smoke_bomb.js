import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class smokeBombSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1煙玉";
        this.cooldown = 20 * 20;
    }

    execute(player) {
        const dimension = player.dimension;
        const location = player.location;

        dimension.spawnParticle("ptl:smoke_screen", location);

        //atodenannkatuikasuru
        //player.runCommand("playsound xxxx @a ~ ~ ~ 1 1");

        const targets = this.getTargets(player, location, 5);
        for (const target of targets) {
            const dir = {
                x: target.location.x - location.x,
                z: target.location.z - location.z
            };
            const len = Math.sqrt(dir.x ** 2 + dir.z ** 2) || 1;
            target.applyKnockback(
                { x: dir.x / len, z: dir.z / len },
                0.2
            );
        }

        player.addEffect("invisibility", 10 * 20, { amplifier: 0, showParticles: true });

        this.onCooldown(player);
    }
}
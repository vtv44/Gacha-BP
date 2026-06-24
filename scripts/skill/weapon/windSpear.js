import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class windSpearSkill extends skillBase {
    constructor() {
        super();
        this.id = "§aウィンドスピアー"; 
        this.cooldown = 20 * 2; 
    }

    execute(player) {
        player.sendMessage("§a突撃の構え...");
        player.dimension.playSound("random.bow", player.location, { volume: 1.0, pitch: 0.5 });

        this.onCooldown(player);

        system.runTimeout(() => {
            if (!player || !player.isValid) return;

            try { player.clearVelocity(); } catch(e) {}

            const viewDir = player.getViewDirection();
            const dashPower = 7.0; 

            player.applyKnockback({ x: viewDir.x * dashPower, z: viewDir.z * dashPower }, 0);

            player.dimension.playSound("mob.enderdragon.flapan", player.location, { volume: 1.0, pitch: 1.5 });
            player.sendMessage("§aウィンドスピアー！");

            try {
                player.runCommand("particle minecraft:sonic_explosion ~ ~1 ~");
            } catch(e) {}

        }, 5);
    }
}
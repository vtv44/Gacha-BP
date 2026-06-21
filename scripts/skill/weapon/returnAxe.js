import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class returnAxeSkill extends skillBase {
    constructor() {
        super();
        this.id = "§6リターンアックス"; 
        this.cooldown = 20 * 20;
    }

    execute(player) {
        const returnLocation = player.location;
        const returnDimension = player.dimension;

        player.dimension.playSound("mob.endermen.portal", returnLocation, { volume: 1.0, pitch: 0.8 });
        player.sendMessage("§6§e位置を記録しました！3秒後に戻ります...");

        this.onCooldown(player);

        system.runTimeout(() => {
            player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.2 });

            player.teleport(returnLocation, { dimension: returnDimension });

            player.dimension.playSound("mob.endermen.portal", returnLocation, { volume: 1.0, pitch: 1.0 });
            player.sendMessage("§6記録した位置に帰還しました！");
            
        }, 60);
    }
}
import { skillBase } from "../skillBase";

export class speedUpSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1スピードアップ";
        this.cooldown = 1 * 20;
    }

    execute(player) {
        const result = player.getEntitiesFromViewDirection({
            maxDistance: 20,
            ignoreBlockCollision: false
        });

        const target = result.length > 0 ? result[0].entity : null;
        const teammates = this.getTargets(player, player.location, 20, 0, false);
        const teammate = target && teammates.includes(target) ? target : null;

        if (teammate) {
            // 味方検知あり
            const duration = 10 * 20;
            player.addEffect("speed", duration, { amplifier: 1, showParticles: false });
            player.addEffect("jump_boost", duration, { amplifier: 1, showParticles: false });
            teammate.addEffect("speed", duration, { amplifier: 1, showParticles: false });
            teammate.addEffect("jump_boost", duration, { amplifier: 1, showParticles: false });

            player.runCommand("playsound voice.BLACK_2 @s ~ ~ ~");
            player.runCommand("particle xxxx ~ ~ ~");
            teammate.runCommand("playsound voice.BLACK_2 @s ~ ~ ~");
            teammate.runCommand("particle xxxx ~ ~ ~");
        } else {
            // 味方検知なし
            const duration = 20 * 20;
            player.addEffect("speed", duration, { amplifier: 1, showParticles: false });
            player.addEffect("jump_boost", duration, { amplifier: 1, showParticles: false });

            player.runCommand("playsound voice.BLACK_1 @s ~ ~ ~");
            // player.runCommand("particle xxxx ~ ~ ~");
        }

        this.onCooldown(player);
    }
}
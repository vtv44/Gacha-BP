import { skillBase } from "../skillBase";

export class speedUpSkill extends skillBase {
    constructor() {
        super();
        this.id = "§aスピードアップ";
        this.cooldown = 45 * 20;
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
            const duration = 15 * 20;
            player.addEffect("speed", duration, { amplifier: 1, showParticles: true });
            player.addEffect("jump_boost", duration, { amplifier: 1, showParticles: true });
            teammate.addEffect("speed", duration, { amplifier: 1, showParticles: true });
            teammate.addEffect("jump_boost", duration, { amplifier: 1, showParticles: true });

            player.runCommand("playsound voice.BLACK_2 @s ~ ~ ~");
            player.runCommand("particle rca:arrow_cyan ~ ~ ~");
            player.runCommand("playsound random.potion.brewed @s ~ ~ ~");
            teammate.runCommand("playsound voice.BLACK_2 @s ~ ~ ~");
            teammate.runCommand("particle rca:arrow_cyan ~ ~ ~");
            teammate.runCommand("playsound random.potion.brewed @s ~ ~ ~");
        } else {
            const duration = 30 * 20;
            player.addEffect("speed", duration, { amplifier: 1, showParticles: true });
            player.addEffect("jump_boost", duration, { amplifier: 1, showParticles: true });

            player.runCommand("playsound voice.BLACK_1 @s ~ ~ ~");
            player.runCommand("playsound random.potion.brewed @s ~ ~ ~");
            player.runCommand("particle rca:arrow_cyan ~ ~ ~");
        }

        this.onCooldown(player);
    }
}
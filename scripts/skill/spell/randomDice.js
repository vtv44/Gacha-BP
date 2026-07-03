import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class randomDiceSkill extends skillBase {
    constructor() {
        super();
        this.id = "§5ランダムダイス";
        this.cooldown = 1 * 20;
    }

    execute(player) {
        this.consumeItem(player); 

        const duration = 200; 

        if (Math.random() < 0.5) {
            player.runCommand("effect @s clear");
            this.clearEffectSetTime(player, duration);
            player.runCommand("playsound voice.harubagu_4 @s ~ ~ ~");
        } else {
            const targets = this.getTargets(player, player.location, 100, 0, true);
            
            for (const target of targets) {
                target.runCommand("effect @s clear");
                this.clearEffectSetTime(target, duration);
            }
            player.runCommand("playsound voice.harubagu_5 @a ~ ~ ~");
        }
    }
}
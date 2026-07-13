import { world, GameMode, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class scannerSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1スキャナー";
        this.cooldown = 20 * 30;
    }

    execute(player) {
        const targets = this.getTargets(player, player.location, 15).filter(t => {
            const mode = t.getGameMode();
            return mode !== GameMode.spectator && mode !== GameMode.creative;
        });

        if (targets.length === 0) return;

        this.onCooldown(player);

        for (const target of targets) {
            player.sendMessage({
                rawtext: [{ text: `§1[スキャナー] §r${target.name}を発見` }]
            });
            if (target.nameTag === " ") continue

            target.nameTag = target.name

            system.runTimeout(() => {
                if (world.getDynamicProperty("game")) target.nameTag = " "
            }, this.cooldown - 1)
        }
    }
}
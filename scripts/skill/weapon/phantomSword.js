import { world, system, GameMode } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class phantomSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§dファントムソード";
        this.cooldown = 20 * 2;
    }

    execute(player) {
        player.setGameMode(GameMode.Spectator);
        player.runCommand("playsound mob.ghast.scream @a ~ ~ ~ 1 1.5");

        const particleId = system.runInterval(() => {
            if (!player.isValid) return;
            player.dimension.spawnParticle("rca:tp", player.location);
        }, 2);

        system.runTimeout(() => {
            if (!player.isValid) return;
            system.clearRun(particleId);
            player.setGameMode(GameMode.Survival);
        }, 20);

        this.onCooldown(player);
    }
}
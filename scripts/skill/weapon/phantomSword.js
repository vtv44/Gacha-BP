import { world, system, GameMode } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { game } from "../../game/game";

export class phantomSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§dファントムソード";
        this.cooldown = 20 * 4;
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

            // 【追加】ゲームに参加していない(死んでいる/離脱している)場合はここで処理をストップ
            if (!game.testJoinGame(player)) return;

            player.setGameMode(GameMode.Survival);
        }, 20);

        this.onCooldown(player);
    }
}
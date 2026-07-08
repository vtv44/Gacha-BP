import { world, system, GameMode } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { game } from "../../game/game";

export class phantomArmorSkill extends skillBase {
    constructor() {
        super();
        this.id = "§dファントムアーマー";
        this.cooldown = 0;
    }

    equip(player) {
    }

    onHurt(player, event) {
        const attacker = event.damageSource.damagingEntity;
        if (!attacker || attacker.typeId !== "minecraft:player") return;
        player.setGameMode(GameMode.Spectator);

        player.runCommand("playsound mob.ghast.scream @a ~ ~ ~ 1 1.5");

        const particleId = system.runInterval(() => {
            if (!player.isValid) return;
            player.dimension.spawnParticle("rca:tp", player.location);
        }, 2); // 2ティックごと


        system.runTimeout(() => {
            if (!player.isValid) return;

            system.clearRun(particleId);

            // 追加: ゲームに参加していない(死んでいる/離脱している)場合はここで処理をストップ
            if (!game.testJoinGame(player)) return;

            player.setGameMode(GameMode.Survival);
        }, 10); // 10ティック後
    }
}
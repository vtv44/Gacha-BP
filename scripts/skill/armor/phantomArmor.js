import { system, GameMode } from "@minecraft/server";
import { skillBase } from "../skillBase";

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

        system.runTimeout(() => {
            if (!player.isValid) return;
            player.setGameMode(GameMode.Survival);
        }, 10);
    }
}
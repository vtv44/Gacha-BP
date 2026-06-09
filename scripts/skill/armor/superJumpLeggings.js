import { system, world } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class superJumpLeggingsSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§dスーパージャンプレギンス";
    }

    equip(player) {
        if (!this.canAddEffect(player)) return;
        player.addEffect("jump_boost", 40, { amplifier: 2, showParticles: false });
    }
}

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const armor = player.getComponent("equippable");
        const legs = armor?.getEquipment("Legs");
        if (legs?.nameTag !== "§dスーパージャンプレギンス") continue;

        const vel = player.getVelocity();
        if (player.isJumping && vel.y > 0 && vel.y < 0.5) {
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 2, z: dir.z * 2 }, 0);
            player.runCommand("playsound item.trident.riptide_1 @a ~ ~ ~");
            player.runCommand("particle minecraft:wind_explosion_emitter ~ ~ ~");
        }
    }
}, 1);
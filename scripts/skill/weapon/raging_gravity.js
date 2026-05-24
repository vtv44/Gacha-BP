import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class ragingGravitySkill extends skillBase {
    constructor() {
        super();
        this.id = "§5暴れる重力";
        this.cooldown = 20 * 20;
    }

    execute(player) {
        const targets = this.getTargets(player, player.location, 10).filter(t => t !== player);

        player.runCommand(`particle ptl:abyss_aura ${player.location.x} ${player.location.y} ${player.location.z}`)
        player.runCommand("/playsound mob.wither.ambient @a")

        this.onCooldown(player);

        if (targets.length === 0) return;

        const applyToTargets = (vertical) => {
            for (const target of targets) {
                if (!target.isValid) continue;
                target.applyKnockback({ x: 0, z: 0 }, vertical);
                target.runCommand(`particle minecraft:witchspell_emitter ${target.location.x} ${target.location.y} ${target.location.z}`)
                target.runCommand("playsound beacon.power @a ~ ~ ~ 1 2")
            }
        };

        const sequence = [1.3, -1.3, 1.3, -1.3, 1.3];

        sequence.reduce((tickAcc, vertical) => {
            system.runTimeout(() => applyToTargets(vertical), tickAcc);
            return tickAcc + 20;
        }, 0);
    }
}
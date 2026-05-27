import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class ragingGravitySkill extends skillBase {
    constructor() {
        super();
        this.id = "§5崩壊する重力";
        this.cooldown = 20 * 20;
    }

    execute(player) {
        const location = player.location;

        player.runCommand(`particle gacha:gravity_magic_circle ${location.x} ${location.y} ${location.z}`);
        player.runCommand("/playsound portal.travel @a ~ ~ ~ 1 4");

        this.onCooldown(player);

        system.runTimeout(() => {
    const targets = this.getTargets(player, player.location, 10).filter(t => t !== player);

    if (targets.length === 0) return;

    for (const target of targets) {
        target.runCommand("playsound mob.wither.ambient @a ~ ~ ~ 1 1");
        target.sendMessage({
            rawtext: [{ text: "§rあなたの§5重力§rが壊れる..." }]
        });
        player.sendMessage({
            rawtext: [{ text: `${target.name}の§5重力§rを壊した！` }]
        });
    }

    const applyToTargets = (vertical) => {
        for (const target of targets) {
            if (!target.isValid) continue;
            target.applyKnockback({ x: 0, z: 0 }, vertical);

            const loc = target.location;
            const x = Math.floor(loc.x * 100) / 100;
            const y = Math.floor(loc.y * 100) / 100;
            const z = Math.floor(loc.z * 100) / 100;
            target.runCommand(`particle minecraft:witchspell_emitter ${x} ${y} ${z}`);
            target.runCommand("playsound beacon.power @a ~ ~ ~ 1 2");
        }
    };

    const sequence = [1.3, -1.3, 1.3, -1.3, 1.3];
    sequence.reduce((tickAcc, vertical) => {
        system.runTimeout(() => applyToTargets(vertical), tickAcc);
        return tickAcc + 20;
    }, 0);
}, 40);
    }
}
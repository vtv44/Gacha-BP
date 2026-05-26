import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class ragingGravitySkill extends skillBase {
    constructor() {
        super();
        this.id = "§5憤怒する重力";
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

            // tellraw
            for (const target of targets) {
                target.sendMessage({
                    rawtext: [{ text: "§rあなたの§5重力§rが壊れる..." }]
                });
            }

            const applyToTargets = (vertical) => {
                for (const target of targets) {
                    target.runCommand("playsound mob.wither.ambient @a ~ ~ ~ 1 1");
                    player.sendMessage({
                        rawtext: [{ text: `${target.name}の§5重力§rを壊した！` }]
                                        });

                    if (!target.isValid) continue;
                    target.applyKnockback({ x: 0, z: 0 }, vertical);
                    target.runCommand(`particle minecraft:witchspell_emitter ${target.location.x} ${target.location.y} ${target.location.z}`);
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
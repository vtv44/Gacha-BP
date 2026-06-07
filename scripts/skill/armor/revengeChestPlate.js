import { system, world } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

const regenCooldown = new Set();

export class revengeChestPlateSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§bリベンジチェストプレート";
    }

    equip(player) {
        player.addEffect("speed", 10, { amplifier: 4, showParticles: false });
        player.addEffect("jump_boost", 10, { amplifier: 2, showParticles: false });

        if (!regenCooldown.has(player.id)) {
            player.addEffect("regeneration", 5 * 20, { amplifier: 1, showParticles: false });
            regenCooldown.add(player.id);
            system.runTimeout(() => regenCooldown.delete(player.id), 100);
        }

        const result = player.getEntitiesFromViewDirection({
            maxDistance: 30,
            ignoreBlockCollision: false
        });
        if (result.length > 0) {
            const target = result[0].entity;
            if (target.isValid && target.typeId === "minecraft:player") {
                const targets = this.getTargets(player, player.location, 10);
                if (targets.includes(target)) {
                    target.addEffect("slowness", 200, { amplifier: 4, showParticles: false });
                    target.sendMessage({
                        rawtext: [{ text: `${player.name}に睨まれている。` }]
                    });
                }
            }
        }
    }

    onHurt(player, event) {
        const damage = event.damage;
        const duration = 30 * 20;

        if (damage >= 0 && damage <= 5) {
            player.addEffect("strength", duration, { amplifier: 0, showParticles: false });
            player.addEffect("resistance", duration, { amplifier: 0, showParticles: false });
            // player.runCommand("playsound xxxx @s ~ ~ ~");
            // player.runCommand("particle xxxx ~ ~ ~");

        } else if (damage >= 6 && damage <= 10) {
            player.addEffect("strength", duration, { amplifier: 1, showParticles: false });
            player.addEffect("resistance", duration, { amplifier: 1, showParticles: false });
            player.addEffect("absorption", duration, { amplifier: 0, showParticles: false });
            // player.runCommand("playsound xxxx @s ~ ~ ~");
            // player.runCommand("particle xxxx ~ ~ ~");

        } else if (damage >= 11 && damage <= 15) {
            player.addEffect("strength", duration, { amplifier: 2, showParticles: false });
            player.addEffect("resistance", duration, { amplifier: 2, showParticles: false });
            player.addEffect("fire_resistance", duration, { amplifier: 0, showParticles: false });
            player.addEffect("absorption", duration, { amplifier: 1, showParticles: false });
            // player.runCommand("playsound xxxx @s ~ ~ ~");
            // player.runCommand("particle xxxx ~ ~ ~");

        } else if (damage >= 16) {
            player.addEffect("strength", duration, { amplifier: 3, showParticles: false });
            player.addEffect("resistance", duration, { amplifier: 3, showParticles: false });
            player.addEffect("fire_resistance", duration, { amplifier: 0, showParticles: false });
            player.addEffect("absorption", duration, { amplifier: 2, showParticles: false });
            player.addEffect("speed", duration, { amplifier: 9, showParticles: false });
            // player.runCommand("playsound xxxx @s ~ ~ ~");
            // player.runCommand("particle xxxx ~ ~ ~");
        }
    }
}

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const armor = player.getComponent("equippable");
        const chest = armor?.getEquipment("Chest");
        if (chest?.nameTag !== "§bリベンジチェストプレート") continue;

        const vel = player.getVelocity();
        if (player.isJumping && vel.y > 0 && vel.y < 0.5) {
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 2, z: dir.z * 2 }, 0);
            player.runCommand("playsound item.trident.riptide_1 @a ~ ~ ~");
            player.runCommand("particle minecraft:wind_explosion_emitter ~ ~ ~");
        }
    }
}, 1);
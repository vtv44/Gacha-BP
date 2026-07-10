import { world, system, ItemStack, ItemLockMode } from "@minecraft/server";
import { skillBase } from "../skillBase";

const axeStages = [
    { typeId: "minecraft:wooden_axe", nameTag: "§1ぼろぼろの斧" },
    { typeId: "minecraft:stone_axe",  nameTag: "§5斧" },
    { typeId: "minecraft:iron_axe",   nameTag: "§6血の斧" },
    { typeId: "minecraft:diamond_axe",nameTag: "§d血まみれの斧" },
    { typeId: "gacha:infernal_axe",   nameTag: "§b業火の斧" },
];

const axeLores = {
    "§5斧": [
        "§5[加速] §5右クリック",
        "§5発動するとスピード1が自身に付与される"
    ],
    "§6血の斧": [
        "§6[突進] §5右クリック",
        "§5発動するとスピード2 力1が自身に付与され",
        "§5前方に弱く突進する"
    ],
    "§d血まみれの斧": [
        "§d[斬撃] §5右クリック",
        "§5発動するとスピード3 力2が自身に付与され",
        "§5前方に突進し近くの敵プレイヤーに対して斬撃を与える"
    ],
    "§b業火の斧": [
        "§b[破壊] §5右クリック",
        "§5発動するとスピード5 力4 耐性3が自身に付与され",
        "§5前方に飛び上がり急降下攻撃を行う",
        "§5攻撃した相手を燃やす"
    ],
};

const activeMeteorPlayers = new Set();

export class infernalAxeSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1ぼろぼろの斧";
        this.cooldown = 5 * 20;

        world.afterEvents.entityHurt.subscribe((event) => {
            const hurtEntity = event.hurtEntity;
            if (hurtEntity.typeId === "minecraft:player" && activeMeteorPlayers.has(hurtEntity.id)) {
                if (event.damageSource.cause === "fall") {
                    const health = hurtEntity.getComponent("minecraft:health");
                    if (health) {
                        const current = health.currentValue;
                        if (current > 0) {
                            health.setCurrentValue(Math.min(health.effectiveMax, current + event.damage));
                        }
                    }
                }
            }
        });
    }

    getCurrentStage(player) {
        const inv = player.getComponent("inventory");
        if (!inv || !inv.container) return -1;
        const held = inv.container.getItem(player.selectedSlotIndex);
        if (!held) return -1;
        return axeStages.findIndex(s => s.nameTag === held.nameTag);
    }

    evolve(player) {
        try {
            const stage = this.getCurrentStage(player);
            if (stage < 0 || stage >= axeStages.length - 1) return;

            const next = axeStages[stage + 1];
            const newItem = new ItemStack(next.typeId, 1);
            newItem.nameTag = next.nameTag;
            newItem.lockmode = ItemLockMode.inventory

            const lore = axeLores[next.nameTag];
            if (lore && typeof newItem.setLore === "function") {
                newItem.setLore(lore);
            }

            const inv = player.getComponent("inventory");
            if (inv && inv.container && typeof inv.container.setItem === "function") {
                inv.container.setItem(player.selectedSlotIndex, newItem);
            }

            if (typeof player.sendMessage === "function") {
                player.sendMessage("§b武器が進化しました。");
            } else {
                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§b武器が進化しました。"}]}`);
            }

            if (player.dimension && typeof player.dimension.spawnParticle === "function") {
                player.dimension.spawnParticle("ptl:golden_aura_1", player.location);
                player.dimension.playSound("random.levelup", player.location, { volume: 1.0, pitch: 1.5 });
            } else {
                player.runCommandAsync(`particle ptl:golden_aura_1 ~ ~ ~`);
                player.runCommandAsync(`playsound random.levelup @s ~ ~ ~ 1.0 1.5`);
            }
        } catch (e) {}
    }

    execute(player) {
        const stage = this.getCurrentStage(player);
        if (stage <= 0) return;

        const dimension = player.dimension;
        const location = player.location;

        dimension.spawnParticle("minecraft:wax_on_particle", location);

        if (stage === 1) {
            if (this.canAddEffect(player)) {
                player.addEffect("speed", 5 * 20, { amplifier: 0, showParticles: false });
            }
            dimension.playSound("random.pop", location, { volume: 1.0 });
            dimension.spawnParticle("rca:arrow_cyan", location);
        }

        if (stage === 2) {
            if (this.canAddEffect(player)) {
                player.addEffect("speed", 5 * 20, { amplifier: 1, showParticles: false });
                player.addEffect("strength", 5 * 20, { amplifier: 0, showParticles: false });
            }
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 2, z: dir.z * 2 }, 0);

            dimension.playSound("item.trident.riptide_1", location, { volume: 1.0 });
            dimension.spawnParticle("rca:arrow_cyan", location);
            dimension.spawnParticle("rca:arrow_red", location);
        }

        if (stage === 3) {
            if (this.canAddEffect(player)) {
                player.addEffect("speed", 5 * 20, { amplifier: 2, showParticles: false });
                player.addEffect("strength", 5 * 20, { amplifier: 1, showParticles: false });
            }
            
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 4.5, z: dir.z * 4.5 }, 0);

            dimension.playSound("item.trident.riptide_2", location, { volume: 1.0 });
            dimension.spawnParticle("rca:arrow_cyan", location);
            dimension.spawnParticle("rca:arrow_red", location);

            let tickCount3 = 0;
            const hitTargets = new Set();

            const slashIntervalId = system.runInterval(() => {
                tickCount3++;
                if (tickCount3 > 10 || !player.isValid) {
                    system.clearRun(slashIntervalId);
                    return;
                }

                const targets = this.getTargets(player, player.location, 2);
                for (const target of targets) {
                    if (hitTargets.has(target.id)) continue;
                    hitTargets.add(target.id);

                    target.applyDamage(5, {
                        cause: "entityAttack",
                        damagingEntity: player
                    });
                    const tLoc = target.location;
                    player.dimension.spawnParticle("rca:sweep_lightblue_v", { x: tLoc.x, y: tLoc.y + 1, z: tLoc.z });
                    
                    player.dimension.playSound("item.sword.crit", tLoc, { volume: 1.0 });
                    player.dimension.playSound("random.anvil_land", tLoc, { volume: 1.0, pitch: 1.5 });
                }
            }, 1);
        }

        if (stage === 4) {
            activeMeteorPlayers.add(player.id);

            if (this.canAddEffect(player)) {
                player.addEffect("strength", 5 * 20, { amplifier: 3, showParticles: false });
                player.addEffect("speed", 5 * 20, { amplifier: 4, showParticles: false });
                player.addEffect("resistance", 5 * 20, { amplifier: 2, showParticles: false });
                player.addEffect("regeneration", 5 * 20, { amplifier: 4, showParticles: false });
            }

            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 3, z: dir.z * 3 }, 1.5);

            dimension.playSound("item.trident.riptide_3", location, { volume: 5.0 });
            dimension.playSound("fire.ignite", location, { volume: 5.0 });
            
            dimension.spawnParticle("minecraft:wind_explosion_emitter", location);
            dimension.spawnParticle("rca:arrow_cyan", location);
            dimension.spawnParticle("rca:arrow_red", location);
            dimension.spawnParticle("rca:arrow_gray", location);

            let tickCount = 0;
            let hasDropped = false;

            const checkId = system.runInterval(() => {
                tickCount++;
                if (tickCount > 200) {
                    system.clearRun(checkId);
                    activeMeteorPlayers.delete(player.id);
                    return;
                }

                if (tickCount === 20) {
                    player.applyKnockback({ x: 0, z: 0 }, -3.5);
                    hasDropped = true;
                }

                if (hasDropped && player.isOnGround && tickCount > 20) {
                    system.clearRun(checkId);
                    activeMeteorPlayers.delete(player.id);

                    const landPos = player.location;
                    const landDimension = player.dimension;

                    landDimension.playSound("firework.blast", landPos, { volume: 5.0 });
                    landDimension.playSound("ambient.weather.thunder", landPos, { volume: 5.0 });
                    landDimension.playSound("player.mace.smash_ground", landPos, { volume: 5.0 });
                    landDimension.playSound("random.anvil_land", landPos, { volume: 5.0, pitch: 0.5 });
                    landDimension.playSound("random.explode", landPos, { volume: 5.0, pitch: 1.0 });
                    landDimension.playSound("random.explode", landPos, { volume: 5.0, pitch: 2.0 });
                    landDimension.playSound("random.explode", landPos, { volume: 5.0, pitch: 3.0 });

                    landDimension.spawnParticle("rca:hee_orange", landPos);
                    landDimension.spawnParticle("ptl:fire_pillar_instant", landPos);
                    landDimension.spawnParticle("ptl:fire_spark", landPos);
                    landDimension.spawnParticle("kitpvp:fortitude_flame", landPos);

                    const targets = this.getTargets(player, landPos, 4);
                    for (const target of targets) {
                        target.applyDamage(20, {
                            cause: "entityAttack",
                            damagingEntity: player
                        });
                        target.setOnFire(5);
                        const loc = target.location;
                        const dx = loc.x - landPos.x;
                        const dz = loc.z - landPos.z;
                        const len = Math.sqrt(dx * dx + dz * dz) || 1;
                        target.applyKnockback({ x: dx / len * 2.5, z: dz / len * 2.5 }, 1);
                    }
                }
            }, 1);
        }

        this.onCooldown(player);
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target || !target.isValid) return;

        const stage = this.getCurrentStage(player);
        if (stage < 0) return;

        if (stage === 4) {
            target.setOnFire(3);
        }

        system.run(() => {
            if (!target.isValid) return;

            const health = target.getComponent("minecraft:health");
            if (target.isDeadOrDying || (health && health.currentValue <= 0)) {
                this.evolve(player);
            }
        });
    }
}

export const axeSkillIds = axeStages.map(s => s.nameTag);
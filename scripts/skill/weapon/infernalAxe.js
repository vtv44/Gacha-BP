import { world, system, ItemStack } from "@minecraft/server";
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
        "§f[§5スキル§f] §5右クリック",
        "§5スピード1付与"
    ],
    "§6血の斧": [
        "§f[§6スキル§f] §6右クリック",
        "§6スピード2・力1・突進"
    ],
    "§d血まみれの斧": [
        "§f[§dスキル§f] §d右クリック",
        "§dスピード3・力2・突進"
    ],
    "§b業火の斧": [
        "§f[§bスキル§f] §b右クリック",
        "§b正面・上方向突進→着地で範囲大ダメージ・吹き飛ばし・延焼",
        "§b攻撃に常時炎付与"
    ],
};

// クラス名を skillRegister.js と完全に合わせました
export class infernalAxeSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1ぼろぼろの斧";
        this.cooldown = 5 * 20;
    }

    getCurrentStage(player) {
        const held = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
        if (!held) return -1;
        return axeStages.findIndex(s => s.nameTag === held.nameTag);
    }

    evolve(player) {
        const stage = this.getCurrentStage(player);
        if (stage < 0 || stage >= axeStages.length - 1) return;

        const next = axeStages[stage + 1];
        const newItem = new ItemStack(next.typeId, 1);
        newItem.nameTag = next.nameTag;

        const lore = axeLores[next.nameTag];
        if (lore) newItem.setLore(lore);

        player.getComponent("inventory").container.setItem(player.selectedSlotIndex, newItem);
    }

    execute(player) {
        const stage = this.getCurrentStage(player);
        if (stage < 0) return;

        if (stage === 0) {
            // 木の斧: スキルなし
            return;
        }

        if (stage === 1) {
            // 石の斧: スピード1
            player.addEffect("speed", 5 * 20, { amplifier: 0, showParticles: false });
        }

        if (stage === 2) {
            // 鉄の斧: スピード2 力1 突進
            player.addEffect("speed", 5 * 20, { amplifier: 1, showParticles: false });
            player.addEffect("strength", 5 * 20, { amplifier: 0, showParticles: false });
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 2, z: dir.z * 2 }, 0);
        }

        if (stage === 3) {
            // ダイヤの斧: スピード3 力2 突進
            player.addEffect("speed", 5 * 20, { amplifier: 2, showParticles: false });
            player.addEffect("strength", 5 * 20, { amplifier: 1, showParticles: false });
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 3, z: dir.z * 3 }, 0);
        }

        if (stage === 4) {
            // infernal_axe: 正面・上方向突進→着地で範囲ダメージ
            const dir = player.getViewDirection();
            player.applyKnockback({ x: dir.x * 3, z: dir.z * 3 }, 2);

            let tickCount = 0;

            const checkId = system.runInterval(() => {
                tickCount++;
                if (tickCount > 200) {
                    system.clearRun(checkId);
                    return;
                }

                if (player.isOnGround && tickCount > 5) {
                    system.clearRun(checkId);

                    const landPos = player.location;

                    player.applyKnockback({ x: 0, z: 0 }, -3);

                    const targets = this.getTargets(player, landPos, 3);
                    for (const target of targets) {
                        target.applyDamage(20);
                        target.setOnFire(5);
                        const loc = target.location;
                        const dx = loc.x - landPos.x;
                        const dz = loc.z - landPos.z;
                        const len = Math.sqrt(dx * dx + dz * dz) || 1;
                        target.applyKnockback({ x: dx / len * 3, z: dz / len * 3 }, 1);
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

        // infernal_axeは炎付与
        if (stage === 4) {
            target.setOnFire(3);
        }

        // ★キル検知の修正
        // 1ティック後(system.run)に判定を遅らせることで、
        // 敵の体力が0以下になった状態や消滅状態を確実にキャッチして進化させます。
        system.run(() => {
            const health = target.isValid ? target.getComponent("minecraft:health") : null;
            
            if (!target.isValid || target.isDeadOrDying || (health && health.currentValue <= 0)) {
                this.evolve(player);
            }
        });
    }
}

export const axeSkillIds = axeStages.map(s => s.nameTag);
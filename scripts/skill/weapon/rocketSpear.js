import { skillBase } from "../skillBase";
import { system, EntityDamageCause, ItemStack, GameMode, world } from "@minecraft/server";

export class rocketSpearSkill extends skillBase {
    constructor() {
        super();
        this.id = "ロケットスピア";
        this.cooldown = 10 * 20;
    }

    execute(player) {
        if (!this.canUse(player)) return;
        this.onCooldown(player);

        const dimension = player.dimension;
        const loc = player.location;
        const viewDir = player.getViewDirection();

        // 手持ちスロットを直接新アイテムで上書き（消去→再付与を確実に）
        const slot = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex);
        system.runTimeout(() => {
            const newItem = new ItemStack("wooden_spear", 1);
            newItem.nameTag = this.id;
            slot.setItem(newItem);
        }, 1);

        const length = 15;
        const steps = 30;
        const hitRadius = 1.5;

        const hitTargets = new Set();

        for (let i = 1; i <= steps; i++) {
            const t = (i / steps) * length;

            system.runTimeout(() => {
                const particleLoc = {
                    x: loc.x + viewDir.x * t,
                    y: loc.y + viewDir.y * t + 1.6,
                    z: loc.z + viewDir.z * t,
                };

                dimension.spawnParticle("minecraft:critical_hit_emitter", particleLoc);

                // プレイヤーとモブ両方を取得
                const entities = dimension.getEntities({
                    location: particleLoc,
                    maxDistance: hitRadius,
                    excludeTypes: ["minecraft:player"], // プレイヤーは別途取得
                }).filter(e => e.id !== player.id && e.isValid);

                const players = dimension.getPlayers({
                    location: particleLoc,
                    maxDistance: hitRadius,
                    excludeGameModes: [GameMode.Spectator],
                }).filter(p => p.id !== player.id);

                // チームスコアで味方除外
                let teamScore = -1;
                try {
                    teamScore = world.scoreboard.getObjective("team").getScore(player);
                } catch {}

                const allTargets = [
                    ...entities,
                    ...players.filter(p => {
                        try {
                            return world.scoreboard.getObjective("team").getScore(p) !== teamScore;
                        } catch {
                            return true;
                        }
                    })
                ];

                for (const target of allTargets) {
                    if (hitTargets.has(target.id)) continue;
                    hitTargets.add(target.id);
                    target.applyDamage(5, { cause: EntityDamageCause.none });
                }
            }, Math.floor(i * 0.5));
        }

        dimension.playSound("mob.arrow.hit_player", loc, { volume: 1.0, pitch: 0.8 });
    }
}
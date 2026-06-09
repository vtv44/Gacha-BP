import { system } from "@minecraft/server"; // systemを追加
import { tickSkillBase } from "../skillBase";

export class superSlowHelmetSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§dスーパースローヘルメット";
    }

    equip(player) {
        const result = player.getEntitiesFromViewDirection({
            maxDistance: 30,
            ignoreBlockCollision: false
        });

        if (result.length === 0) return;

        const target = result[0].entity;
        if (!target.isValid) return;

        if (target.typeId === "minecraft:player") {
            const targets = this.getTargets(player, player.location, 10);
            if (!targets.includes(target)) return;

            const lastMessageTime = target.getDynamicProperty("lastLookedMessageTime") ?? 0;
            if (system.currentTick >= lastMessageTime) {
                target.sendMessage({
                    rawtext: [{ text: `${player.name}に強く§j睨まれている。` }]
                });
                target.setDynamicProperty("lastLookedMessageTime", system.currentTick + 100);
            }
        }

        target.addEffect("slowness", 100, { amplifier: 4, showParticles: true });
    }
}
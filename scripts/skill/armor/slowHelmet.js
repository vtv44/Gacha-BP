import { tickSkillBase } from "../skillBase";
import { system } from "@minecraft/server"; // systemを追加

export class slowHelmetSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§1スローヘルメット";
    }

    equip(player) {
        if (!this.canAddEffect(player)) return;
        
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
                    rawtext: [{ text: `${player.name}§j睨まれている。` }]
                });
                target.setDynamicProperty("lastLookedMessageTime", system.currentTick + 100);
            }
        }

        target.addEffect("slowness", 100, { amplifier: 0, showParticles: true });
    }
}
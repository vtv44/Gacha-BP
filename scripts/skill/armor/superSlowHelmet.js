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

            target.sendMessage({
                rawtext: [{ text: `${player.name}に睨まれている。` }]
            });
        }

        target.addEffect("slowness", 100, { amplifier: 4, showParticles: true });
    }
}
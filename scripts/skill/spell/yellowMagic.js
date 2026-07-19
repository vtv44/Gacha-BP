import { skillBase } from "../skillBase";

export class yellowMagicSkill extends skillBase {
    constructor() {
        super()
        this.id = "§1黄色の魔力"
        this.cooldown = 15 * 20
    }

    execute(player) {
        this.consumeItem(player);

        const pos = player.location;
        const targets = this.getTargets(player, pos, 10);

        for (const target of targets) {
            if (!this.canAddEffect(target)) continue;
            target.addEffect("poison", 15 * 20, { amplifier: 0 });
            target.setOnFire(15);
        }

        const dimension = player.dimension;
        dimension.playSound("random.fizz", pos, { pitch: 0.8 });
        dimension.playSound("mob.witch.celebrate", pos);
        dimension.spawnParticle("rca:spell_spread_yellow", pos);
        dimension.spawnParticle("rca:spell_yellow", pos);
        this.onCooldown(player);
    }
}

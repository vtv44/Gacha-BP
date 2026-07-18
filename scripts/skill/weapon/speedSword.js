import { system, EntityDamageCause } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { CooldownManager } from "../cooldownManager";

export class speedSwordSkill extends skillBase {
    constructor() {
        super()
        this.id = "§5レイピア"
        this.cooldown = 5 * 20
        this.attackCooldown = 1 * 20
    }

    execute(player) {
        if (!this.canAddEffect(player)) return;
        player.addEffect("speed", 10 * 20, { amplifier: 4 });
        player.playSound("mob.endermite.hit");
        this.onCooldown(player);
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target) return;
        if (CooldownManager.has(player, this.id + "_atk")) return;

        CooldownManager.set(player, this.id + "_atk", this.attackCooldown);

        system.runTimeout(() => {
            if (!target.isValid) return;
            target.applyDamage(1, { cause: EntityDamageCause.selfDestruct, damagingEntity: player });
        }, 2);
        system.runTimeout(() => {
            if (!target.isValid) return;
            target.applyDamage(1, { cause: EntityDamageCause.selfDestruct, damagingEntity: player });
        }, 4);
    }
}

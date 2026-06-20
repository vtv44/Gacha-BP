import { skillBase } from "../skillBase";
import { system, EntityDamageCause } from "@minecraft/server";

export class powerChargeSkill extends skillBase {
    constructor() {
        super();
        this.id = "力溜め";
        this.cooldown = 60 * 20;
    }

    execute(player) {
        if (!this.canUse(player)) return;
        this.onCooldown(player);

        const expireTick = system.currentTick + 20 * 20;
        player.setDynamicProperty("powerChargeTick", expireTick);

        player.onScreenDisplay.setActionBar("§e次の攻撃のダメージが+2！");
        player.playSound("random.orb", { volume: 1.0, pitch: 1.2 });
    }

    onDamage(player, event) {
        const expireTick = player.getDynamicProperty("powerChargeTick");
        if (!expireTick) return;
        if (system.currentTick > expireTick) return;

        const target = event.hurtEntity;
        if (!target.isValid) return;

        const targets = this.getTargets(player, player.location, 20);
        if (!targets.includes(target)) return;

        player.setDynamicProperty("powerChargeTick", 0);

        target.applyDamage(2, { cause: EntityDamageCause.none });

        player.onScreenDisplay.setActionBar("§e力溜め発動！");
        player.playSound("random.orb", { volume: 1.0, pitch: 0.8 });
    }
}
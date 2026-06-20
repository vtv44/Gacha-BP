import { skillBase } from "../skillBase";
import { system } from "@minecraft/server";

export class thunderSword extends skillBase {
    constructor() {
        super();
        this.id = "§1サンダーソード";
        this.cooldown = 25 * 20;
    }

    onDamage(player, event) {
        if (!this.canUse(player)) return;
        this.onCooldown(player);

        const target = event.hurtEntity;
        if (!target.isValid) return;

        const targets = this.getTargets(player, player.location, 20);
        if (!targets.includes(target)) return;

        target.applyKnockback({ x: 0, z: 0 }, 1.2);

        system.runTimeout(() => {
            if (!target.isValid) return;
            const loc = target.location;
            target.dimension.runCommand(
                `summon minecraft:lightning_bolt ${loc.x} ${loc.y} ${loc.z}`
            );
        }, 10);
    }
}
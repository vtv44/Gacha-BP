import { system, EntityDamageCause } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class vKillerSkill extends skillBase {
    constructor() {
        super()
        this.id = "§6V killer"
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target || target.typeId !== "minecraft:player") return;

        const name = target.name;
        if (name.includes("V") || name.includes("v")) {
            system.runTimeout(() => {
                if (!target.isValid) return;
                target.applyDamage(event.damage, { cause: EntityDamageCause.selfDestruct });
            }, 2);

            const dimension = player.dimension;
            const playerPos = player.location;
            const targetPos = target.location;

            dimension.playSound("respawn_anchor.charge", playerPos);
            dimension.spawnParticle("rca:sweep_green", { x: targetPos.x, y: targetPos.y + 1, z: targetPos.z });
        }
    }
}

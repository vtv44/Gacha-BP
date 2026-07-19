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
            target.applyDamage(event.damage, { cause: "entityAttack", damagingEntity: player });

            const dimension = player.dimension;
            const playerPos = player.location;
            const targetPos = target.location;

            dimension.playSound("respawn_anchor.charge", playerPos);
            dimension.spawnParticle("rca:golden_sword", { x: playerPos.x, y: playerPos.y + 2, z: playerPos.z });
            dimension.spawnParticle("rca:sweep_green_v", { x: targetPos.x, y: targetPos.y + 1, z: targetPos.z });
        }
    }
}

import { skillBase } from "../skillBase";

export class deadbushSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1枯れ枯れソード";
        this.cooldown = 10 * 20;
    }

    execute(player) {
        const dimension = player.dimension;
        const location = player.location;

        dimension.playSound("mob.zombie.remedy", location, { volume: 1.0, pitch: 0.8 });

        const targets = this.getTargets(player, location, 6);
        let hitAnyTarget = false;

        for (const target of targets) {
            hitAnyTarget = true;

            target.runCommand("effect @s hunger 4 99 true");
            
            const tLoc = target.location;
            target.dimension.spawnParticle("rca:carrot", { x: tLoc.x, y: tLoc.y + 1, z: tLoc.z });

            if (target.typeId === "minecraft:player") {
                target.sendMessage("§b満腹度を奪われてしまった...");
            }
        }

        if (hitAnyTarget) {
            player.sendMessage("§b敵から満腹度を奪った!");
            player.addEffect("saturation", 20, { amplifier: 255, showParticles: false });
        } else {
            player.sendMessage("§b敵は近くにいなかった...");
        }

        this.onCooldown(player);
    }

    onDamage(player, event) {
        event.hurtEntity.runCommand("effect @s hunger 10 0 true");
    }
}
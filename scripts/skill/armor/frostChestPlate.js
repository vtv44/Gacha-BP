import { system, EntityDamageCause } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";
import { CooldownManager } from "../cooldownManager";

export class frostChestPlateSkill extends tickSkillBase {
    constructor() {
        super()
        this.id = "§6フロストチェストプレート"
        this.cooldown = 200
    }

    equip(player) {
        if (!player.isSneaking) return;
        if (CooldownManager.has(player, this.id)) return;

        const pos = player.location;
        const dimension = player.dimension;

        for (let i = 0; i < 3; i++) {
            dimension.spawnParticle("ptl:ice_berg", pos);
            dimension.spawnParticle("ptl:ice_aura", pos);
            dimension.spawnParticle("ptl:ice_weather", pos);
        }

        dimension.playSound("mob.zombie.woodbreak", pos, { pitch: 0.3 });
        system.runTimeout(() => {
            dimension.playSound("mob.zombie.woodbreak", pos, { pitch: 0.4 });
        }, 2);
        system.runTimeout(() => {
            dimension.playSound("mob.zombie.woodbreak", pos, { pitch: 0.5 });
        }, 4);

        CooldownManager.set(player, this.id, this.cooldown);

        const targets = this.getTargets(player, pos, 5);
        for (const target of targets) {
            target.applyDamage(6, { cause: EntityDamageCause.entityAttack, damagingEntity: player });
            target.addEffect("slowness", 60, { amplifier: 4 });
            target.applyKnockback({ x: 0, z: 0 }, 2.0);
        }

        let count = 0;
        const intervalId = system.runInterval(() => {
            count++;
            if (count >= 12) {
                system.clearRun(intervalId);
                return;
            }
            const areaTargets = this.getTargets(player, pos, 5);
            for (const t of areaTargets) {
                t.applyDamage(1, { cause: EntityDamageCause.entityAttack, damagingEntity: player });
                t.addEffect("slowness", 20, { amplifier: 4 });
            }
        }, 10);
    }
}

import { skillBase } from "../skillBase";

export class shockWeaknessSwordSkill extends skillBase {
    constructor() {
        super()
        this.id = "§d衝撃的な弱さの剣"
        this.cooldown = 30 * 20
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target || !this.canAddEffect(target)) return;
        target.addEffect("weakness", 1 * 20, { amplifier: 3 });
        target.dimension.spawnParticle("gacha:weakness_particle", { x: target.location.x, y: target.location.y + 1.4, z: target.location.z });
        target.dimension.playSound("mob.pillager.hurt", target.location);
    }

    execute(player) {
        if (!this.canAddEffect(player)) return;
        player.addEffect("absorption", 30 * 20, { amplifier: 1 });
        player.playSound("mob.endermite.hit");
        this.onCooldown(player);
    }
}

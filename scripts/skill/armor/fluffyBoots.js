import { tickSkillBase } from "../skillBase";

export class fluffyBootsSkill extends tickSkillBase {
    constructor() {
        super();
        this.id = "§aふわふわブーツ";
    }

    equip(player) {
        if (!player.isOnGround && this.canAddEffect(player)) {
            player.addEffect("slow_falling", 10, { amplifier: 0, showParticles: false });
        }
    }
}
import { tickSkillBase } from "../skillBase"

export class speedBootsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§1スピードブーツ"
    }

    equip(player) {
        if (!this.canAddEffect(player)) return;
        player.addEffect("speed", 20)
    }
}
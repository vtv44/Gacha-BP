import { tickSkillBase } from "../skillBase"

export class iceBlockSkill extends tickSkillBase {
    constructor() {
        super()
        this.id = "§1めっちゃ氷"
    }
    equip(player) {
        if (!this.canAddEffect(player)) return;
        player.addEffect("slowness", 20, { amplifier: 0 })
    }
}

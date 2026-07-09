import { tickSkillBase } from "../skillBase";

export class ironDaggerSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§fダガー"
    }

    has(player) {
        if (this.canAddEffect(player)) player.addEffect("speed", 5, {amplifier: 0})
    }
}
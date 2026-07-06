import { skillBase } from "../skillBase";

export class surviveBootsSkill extends skillBase {
    constructor() {
        super()

        this.id = "§a生存者のブーツ"
    }

    onHurt(player, event) {
        if (!player.isValid || !this.canAddEffect(player)) return

        player.addEffect("speed", 2 * 20, {amplifier: 1})
        player.playSound("random.click", {pitch: 1.5})
    }
}
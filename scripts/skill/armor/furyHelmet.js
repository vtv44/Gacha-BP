import { skillBase } from "../skillBase";

export class furyHelmetSkill extends skillBase {
    constructor() {
        super()

        this.id = "§1怒りのヘルメット"
    }

    onHurt(player, event) {
        if (this.canAddEffect(player)) {
            player.addEffect("strength", 3 * 20)
            player.addEffect("speed", 3 * 20)
            player.addEffect("regeneration", 3 * 20)

            player.dimension.playSound("mob.wolf.growl", player.location)
        }
    }
}
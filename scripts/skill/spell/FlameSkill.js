import { CooldownManager } from "../cooldownManager";
import { skillBase } from "../skillBase";

export class FlameSkill extends skillBase {
    constructor() {
        super()
        
        this.id = "flame"
        this.cooldown = 10 * 20
    }

    execute(player) {
        player.sendMessage("魔法を発動したぞ")
        this.onCooldown(player)
    }
}
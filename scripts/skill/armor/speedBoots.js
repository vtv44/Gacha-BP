import { world } from "@minecraft/server"
import { tickSkillBase } from "../skillBase"

export class speedBootsSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§1スピード靴"
    }

    equip(player) {
        player.addEffect("speed", 20)
    }
}
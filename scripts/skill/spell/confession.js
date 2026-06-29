import { world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class confessionSkill extends skillBase {
    constructor() {
        super()

        this.id = "§4愛の告白"
    }

    execute(player) {
        this.consumeItem(player)

        const players = world.getAllPlayers().filter((player))
    }
}
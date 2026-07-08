import { GameMode, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class hyperKineticPositionReverser extends skillBase {
    constructor() {
        super()

        this.id = "§4HKPR"
    }

    execute(player) {
        this.consumeItem(player)

        const dimension = player.dimension
        const pos = player.location

        const players = dimension.getPlayers({minDistance: 2, excludeGameModes: [GameMode.Spectator]})
        const rand = Math.floor(Math.random() * players.length)
        const p = players[rand]

        dimension.playSound("mob.endermen.portal", pos)
        dimension.playSound("mob.endermen.portal", p.location)

        player.teleport(p.location)
        p.teleport(pos)
        p.addEffect("slowness", 3 * 20, {amplifier: 1})
    }
}
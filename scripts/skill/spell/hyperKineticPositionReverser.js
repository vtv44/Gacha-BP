import { GameMode, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class hyperKineticPositionReverser extends skillBase {
    constructor() {
        super()

        this.id = "§4HKPR"
        this.cooldown = 20 * 20
    }

    execute(player) {
        this.onCooldown(player)

        const dimension = player.dimension
        const pos = player.location

        const players = world.getAllPlayers()
        .filter((p) => p.id !== player.id && p.getGameMode() !== GameMode.spectator)
        const rand = Math.floor(Math.random() * players.length)
        const p = players[rand]

        dimension.playSound("mob.endermen.portal", pos)
        dimension.playSound("mob.endermen.portal", p.location)

        player.teleport(p.location)
        p.teleport(pos)
        p.addEffect("slowness", 3 * 20, {amplifier: 1})
    }
}
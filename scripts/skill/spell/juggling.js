import { GameMode, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class jugglingSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6ジャグリング"
        this.cooldown = 10 * 20
    }

    execute(player) {
        this.consumeItem(player)
        this.onCooldown(player)

        const players = player.dimension.getPlayers()
        .filter((p) => p.id !== player.id && p.getGameMode() !== GameMode.spectator)

        if (players.length < 2) {
            player.sendMessage("§c対象のプレイヤーが一人しかいません")
            player.playSound("note.harp", {pitch: 0.8})
            return
        }

        const positions = players.map(p => p.location)

        positions.push(positions.shift())

        for (let i = 0; i < players.length; i++) {
            players[i].teleport(positions[i], {rotation: {x: -180, y: players[i].getRotation().y}})
            players[i].addEffect("blindness", 3 * 20)
            players[i].playSound("mob.witch.celebrate")
        }
    }
}
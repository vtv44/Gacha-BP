import { GameMode, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { ActionFormData } from "@minecraft/server-ui";

export class deathNoteSkill extends skillBase {
    constructor() {
        super()

        this.id = "§4デスなノート"
        this.cooldown = 65 * 20
        this.killTime = 40 * 20
    }

    execute(player) {
        const players = world.getAllPlayers({excludeGameModes: [GameMode.Spectator]})
        .filter((p) => p.id === player.id)
        const form = new ActionFormData().title("§4誰の名前を書く？")
        for (let i = 0; i <= players.length - 1; i++) {
            form.button(`§l${players[i].nameTag}`)
        }
        form.show(player).then(res => {
            if (res.canceled) return
            const p = players[res.selection]
            this.deathNoteKill(p)
            player.sendMessage(` \n§l[!] ${p.nameTag}は${this.killTime / 20}秒後に死亡する...\n `)
            player.getComponent("inventory").container.getSlot(player.selectedSlotIndex).setItem(null)
        })
    }

    deathNoteKill(player) {
        system.runTimeout(() => {
            if (!player.isValid || player.getGameMode() === GameMode.Spectator) return
            const dimension = player.dimension
            const location = player.location
            dimension.spawnParticle("minecraft:huge_explosion_emitter", location)
            dimension.playSound("random.explode", location)
            player.setGameMode(GameMode.Adventure)
            player.kill()
        }, this.killTime)
    }
}
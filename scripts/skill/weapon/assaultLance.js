import { skillBase } from "../skillBase";

export class assaultLance extends skillBase {
    constructor() {
        super()
        this.id = "§a突撃槍"
    }

    onDamage(player, ev) {
        if (this.canAddEffect) player.addEffect("speed", 20)
        player.runCommand("particle kitpvp:ninja_shuriken ~~1.4~")
        player.runCommand("playsound item.trident.return @a ~~~ 1")
    }
}
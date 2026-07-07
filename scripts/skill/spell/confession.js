import { GameMode, ItemStack, world } from "@minecraft/server";
import { skillBase } from "../skillBase";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

export class confessionSkill extends skillBase {
    constructor() {
        super()

        this.id = "§4愛の告白"
    }

    static love = new Map()

    execute(player) {
        const dimension = player.dimension
        const pos = player.location

        const players = world.getAllPlayers()
        .filter((p) => p.id !== player.id && p.getGameMode() !== GameMode.spectator)

        if (!players[0]) return

        player.playSound("random.orb", {pitch: 2})

        const form = new ActionFormData().title("§l§d告白§r§lする相手は...？")
        for (const p of players) {
            form.button(`§l${p.name}`)
        }
        form.show(player).then((res) => {
            if (res.canceled) return

            player.playSound("random.orb", {pitch: 2})

            const num = res.selection

            const form2 = new ModalFormData().title("§lドキドキしちゃう...")
            form2.textField("§lどんな§d文章§r§lにする？", "ここに書いてね")

            form2.show(player).then(async (res) => {
                if (res.canceled) return null

                this.consumeItem(player)

                if (!await this.showConfessionForm(players[num], player, res.formValues[0])) {

                    player.sendMessage(`§lキャー！カップル成立ね、おめでとう！これは私からの祝福！`)
                    player.sendMessage(` \n§l祝福を受け取った\n `)

                    player.addEffect("speed", 1000 * 20, {amplifier: 4, showParticles: false})
                    player.addEffect("jump_boost", 1000 * 20, {amplifier: 2, showParticles: false})
                    player.addEffect("regeneration", 1000 * 20, {amplifier: 2, showParticles: false})
                    player.addEffect("fire_resistance", 1000 * 20, {amplifier: 0, showParticles: false})
                    player.addEffect("saturation", 1000 * 20, {amplifier: 255, showParticles: false})

                    dimension.spawnParticle("minecraft:example_flipbook", {x: pos.x, y: pos.y + 1.2, z: pos.z})
                    dimension.playSound("random.levelup", pos, {pitch: 0.5})
                    dimension.playSound("block.bell.hit", pos)

                } else {

                    const loveSword = new ItemStack("minecraft:wooden_sword", 1)
                    loveSword.nameTag = "§4失恋の剣"
                    loveSword.setLore([
                        "§4[他人の愛] §5攻撃",
                        "§5告白対象に追加で999ダメージを与える"
                    ])

                    player.sendMessage("§4あの子はあなたの想いを踏み躙った...許せない許せない許せない許せない")
                    player.sendMessage(` \n§l${loveSword.nameTag}を手に入れた\n `)

                    player.getComponent("inventory").container.addItem(loveSword)
                    confessionSkill.love.set(player.id, players[num].id)

                    dimension.spawnParticle("shriek.sculk_shrieker", pos)
                }
            })
        })
    }

    async showConfessionForm(player, sender, message) {
        const form = new ActionFormData().title(`§l${sender.name}ちゃんに§d告白§r§lされちゃった...！`)
        form.body(message)
        form.button("§l...§cはい///")
        
        return new Promise((resolve) => {
            form.show(player).then((res) => {
                resolve(res.canceled)
            })
        })
    }
}
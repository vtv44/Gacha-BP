import { ItemLockMode, ItemStack, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class blueBirdOfHappinessSkill extends skillBase {
    constructor() {
        super()

        this.id = "§6幸せを運ぶ青色の鳥"
        this.cooldown = 40 * 20
    }

    execute(player) {
        const dimension = player.dimension
        const location = player.location

        this.onCooldown(player)
        this.consumeItem(player)
        if (this.canAddEffect(player)) {
            player.addEffect("regeneration", 30 * 20, {amplifier: 4})
            player.addEffect("speed", 30 * 20, {amplifier: 4})
            player.addEffect("jump_boost", 30 * 20, {amplifier: 4})
            player.addEffect("village_hero", 30 * 20, {amplifier: 4})
        }

        player.runCommand("particle minecraft:magic_critical_hit_emitter ~~1.4~")
        dimension.playSound("mob.parrot.fly", location)

        const targets = this.getTargets(player, location, 100)
        if (targets[0]) {
            const rand = Math.floor(Math.random() * targets.length - 1)
            const bird = new ItemStack("minecraft:lapis_lazuli")
            bird.nameTag = this.id
            bird.setLore([
                "§1[贈り物] §5右クリック",
                "§5使うとどこかへ飛び去ってしまう"
            ])
            bird.lockmode = ItemLockMode.inventory

            targets[rand].getComponent("inventory").container.addItem(bird)

            player.sendMessage(`§l青色の鳥は${targets[rand].nameTag}の元へと飛んで行った...`)

            targets[rand].sendMessage(`§lどこからか青色の鳥が飛んできた！`)
        } else {
            player.sendMessage(`§l青色の鳥はどこかへ飛んで行ってしまった...`)
        }
    }
}
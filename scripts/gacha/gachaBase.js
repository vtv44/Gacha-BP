import { BlockPermutation, EnchantmentTypes, ItemLockMode, ItemStack, system, world } from "@minecraft/server"

export class gachaBase {

    static cost = 0
    static chance = [
        {id: "common", int: 2000},
        {id: "unCommon", int: 3000},
        {id: "rare", int: 2500},
        {id: "epic", int: 1500},
        {id: "legendary", int: 600},
        {id: "mythic", int: 300},
        {id: "divine", int: 10},
        {id: "special", int: 90},
    ]
    static buttonPos = {x: 0, y: 0, z: 0}
    static cratePos = {x: 0, y: 0, z: 0}
    static gachaPos = {x: 0, y: 0, z: 0}
    static returnPos = {x: 0, y: 0, z: 0}
    static initialRotation = 0

    static buttonPlace() {
        const dimension = world.getDimension("overworld")
        dimension.getBlock(this.buttonPos).setPermutation(
            BlockPermutation.resolve("minecraft:pale_oak_button", {
                facing_direction: 1
            })
        )
    }

    static decision(rarity, player) {
        const dimension = world.getDimension("overworld")

        this.gachaParticles()

        system.runTimeout(() => {
            this.spawnCrate(dimension, this.cratePos)
        }, 60)

        switch(rarity) {
            case "common": return this.common(player)
            case "unCommon": return this.unCommon(player)
            case "rare": return this.rare(player)
            case "epic": return this.epic(player)
            case "legendary": return this.legendary(player)
            case "mythic": return this.mythic(player)
            case "divine": return this.divine(player)
            case "special": return this.special(player) 

            default: 
                console.error(`[GACHA] 無効な数字が入力されました 入力された数字: ${rarity}`)
                break;
        }
    }

    static gachaParticles() {}

    static giveItem(player, itemInfo) {
        const item = new ItemStack(itemInfo.id, itemInfo.amount)
        const enchant = item.getComponent("minecraft:enchantable")
        const e = itemInfo.enchants

        item.nameTag = itemInfo.name
        item.setLore(itemInfo.lore)
        item.lockMode = ItemLockMode.inventory

        if (e && enchant) {
            for (let i = 0; i <= e.length - 1; i++) {
                enchant.addEnchantment({type: EnchantmentTypes.get(e[i].id), level: e[i].level})
            }
        }

        player.getComponent("inventory").container.addItem(item)
    }

    static hasCoin(player) {
        const coinScore = world.scoreboard.getObjective("coin")
        const playerCoin = coinScore.getScore(player)

        if (!playerCoin || playerCoin < this.cost) return false
        return true
    }

    static leaveGacha(player) {
        const dimension = world.getDimension("overworld")
        
        player.teleport(this.returnPos)
        player.removeTag("gachaing")

        this.buttonPlace()
        
        const pos = {
            x: this.buttonPos.x + 0.5,
            y: this.buttonPos.y,
            z: this.buttonPos.z + 0.5,
        }
        dimension.spawnParticle("minecraft:egg_destroy_emitter", pos)
        dimension.playSound("random.pop2", pos)
    }

    static lottery() {
        const random = this.randomInt(10000)
        let int = 0
        for (let i = 0; i <= this.chance.length - 1; i++) {
            int = int + this.chance[i].int
            if (random < int) {
                return this.chance[i].id
            }
        }
    }

    static randomInt(max) {
        // 1 ~ max
        return Math.floor(Math.random() * max) + 1
    }

    static rollGacha(player) {
        if (!this.hasCoin(player)) {
            player.sendMessage("§cガチャを回すにはコインが足りません")
            player.playSound("random.fizz", player.location)
            return
        }
        player.addTag("gachaing")
        player.dimension.setBlockType(this.buttonPos, "minecraft:air")
        world.scoreboard.getObjective("coin").addScore(player, this.cost * -1)
        this.decision(this.lottery(), player)
        player.teleport(this.gachaPos)
    }

    static spawnCrate(dimension, pos) {
        const crate = dimension.spawnEntity("gacha:hightier_chest", pos, {initialRotation: this.initialRotation})
        const pPos = {
            x: this.cratePos.x,
            y: this.cratePos.y + 1.2,
            z: this.cratePos.z,
        }

        system.runTimeout(() => {
            crate.playAnimation("animation.hightier_chest.open", {blendOutTime: 999})
        }, 2)

        system.runTimeout(() => {
            dimension.spawnParticle("minecraft:egg_destroy_emitter", pPos)
            dimension.playSound("random.chestopen", pPos)
        }, 21)

        system.runTimeout(() => {
            dimension.playSound("random.pop", pPos)
        }, 32)

        system.runTimeout(() => {
            dimension.spawnParticle("ptl:java_flash", pPos)
            dimension.spawnParticle("minecraft:knockback_roar_particle", this.cratePos)
            dimension.playSound("random.fizz", pPos)
            if (!crate.isValid) return
            crate.remove()
        }, 40)
    }

    static common(player) {}
    static unCommon(player) {}
    static rare(player) {}
    static epic(player) {}
    static legendary(player) {}
    static mythic(player) {}
    static divine(player) {}
    static special(player) {}
}
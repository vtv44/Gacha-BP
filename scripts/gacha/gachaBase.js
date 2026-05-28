import { EnchantmentTypes, ItemStack, world } from "@minecraft/server"

export class gachaBase {

    constructor() {
        this.cost = 0
        this.chance = [
            {id: "common", int: 3500},
            {id: "unCommon", int: 2500},
            {id: "rare", int: 2000},
            {id: "epic", int: 1000},
            {id: "legendary", int: 500},
            {id: "mythic", int: 300},
            {id: "divine", int: 100},
            {id: "special", int: 100},
        ]
        this.gachaPos = {x: 0, y: 0, z: 0}
        this.returnPos = {x: 0, y: 0, z: 0}
    }

    decision(rarity, player) {
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
                console.error("無効な数字が入力されました")
                break;
        }
    }

    giveItem(player, itemInfo) {
        const item = new ItemStack(itemInfo.id, itemInfo.amount)
        const enchant = item.getComponent("minecraft:enchantable")
        const e = itemInfo.enchants

        item.nameTag = itemInfo.name
        item.setLore(itemInfo.lore)

        if (e && enchant) {
            for (let i = 0; i <= e.length - 1; i++) {
                enchant.addEnchantment({type: EnchantmentTypes.get(e[i].id), level: e[i].level})
            }
        }

        player.getComponent("inventory").container.addItem(item)
    }

    hasCoin(player) {
        const coinScore = world.scoreboard.getObjective("coin")
        const playerCoin = coinScore.getScore(player)

        if (!playerCoin || playerCoin < this.cost) return false
        return true
    }

    lottery() {
        const random = this.randomInt(10000)
        let int = 0
        for (let i = 0; i <= this.chance.length - 1; i++) {
            int = int + this.chance[i].int
            if (random < int) {
                return this.chance[i].id
            }
        }
    }

    randomInt(max) {
        // 1 ~ max
        return Math.floor(Math.random() * max) + 1
    }

    rollGacha(player) {
        if (!this.hasCoin(player)) {
            player.sendMessage("§cガチャを回すにはコインが足りません")
            player.playSound("random.fizz", player.location)
            return
        }
        world.scoreboard.getObjective("coin").addScore(player, this.cost * -1)
        this.decision(this.lottery(), player)
        player.teleport(this.gachaPos)
    }

    common(player) {}
    unCommon(player) {}
    rare(player) {}
    epic(player) {}
    legendary(player) {}
    mythic(player) {}
    divine(player) {}
    special(player) {}
}
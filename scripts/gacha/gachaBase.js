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

        if (!playerCoin || playerCoin < 0) return false
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
}
import { ItemStack } from "@minecraft/server"

export class gachaBase {

    constructor() {
        this.cost = 0
        this.chance = [
            {id: "common", int: 35},
            {id: "unCommon", int: 25},
            {id: "rare", int: 20},
            {id: "epic", int: 10},
            {id: "legendary", int: 5},
            {id: "mythic", int: 3},
            {id: "divine", int: 1},
            {id: "special", int: 1},
        ]
    }

    giveItem(player, itemInfo) {
        const item = new ItemStack(itemInfo.id, itemInfo.amount)
        item.nameTag = itemInfo.name
        item.setLore(itemInfo.lore)
        player.getComponent("inventory").container.addItem(item)
    }

    hasCoin(player) {
        // コインの所持の仕方を決める
    }

    lottery() {
        const random = this.randomInt(10000)
        
    }

    randomInt(max) {
        // 1 ~ max
        return Math.floor(Math.random() * max) + 1
    }
}
import { ItemStack } from "@minecraft/server"

export class gachaBase {

    giveItem(player, itemInfo) {
        const item = new ItemStack(itemInfo.id, itemInfo.amount)
        item.nameTag = itemInfo.name
        item.setLore(itemInfo.lore)
        player.getComponent("inventory").container.addItem(item)
    }

    hasCoin(player) {
        // コインの所持の仕方を決める
    }

    lottery(max) {
        // 1 ~ max
        return Math.floor(Math.random() * max) + 1
    }
}
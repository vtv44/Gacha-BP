import { ItemStack } from "@minecraft/server"
import { weaponItems } from "./weaponGacha/weaponItems"

export class gachaBase {

    giveItem(player, itemInfo) {
        const item = new ItemStack(itemInfo.id, itemInfo.amount)
        item.nameTag = itemInfo.name
        item.setLore() = itemInfo.lore
        player.getComponent("inventory").container.addItem(item)
    }

    hasCoin(player) {
        // コインの所持の仕方を決める
    }

    lottery(max) {
        // AI code しんじるな
        const maxUint32 = 0xFFFFFFFF
        const limit = maxUint32 - (maxUint32 % max)

        const buf = new Uint32Array(1)

        while (true) {
            crypto.getRandomValues(buf)

            const value = buf[0]

            if (value < limit) {
                return value % max
            }
        }
    }
}
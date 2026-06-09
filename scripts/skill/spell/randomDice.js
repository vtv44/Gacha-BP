import { world, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class randomDiceSkill extends skillBase {
    constructor() {
        super();
        this.id = "ランダムダイス";
    }

    execute(player) {
        const slot = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex);
        const item = slot.getItem();
        if (!item) return;

        if (item.amount > 1) {
            item.amount -= 1;
            slot.setItem(item);
        } else {
            slot.setItem(null);
        }
        if (Math.random() < 0.5) {
            // 50%: 自分のエフェクトクリア
            player.runCommand("effect @s clear");
            player.runCommand("playsound voice.harubagu_4 @s ~ ~ ~");
        } else {
            // 50%: 自分以外のエフェクトクリア
            const targets = world.getAllPlayers().filter(p => p.id !== player.id);
            for (const target of targets) {
                target.runCommand("effect @s clear");
            }
            player.runCommand("playsound voice.harubagu_5 @s ~ ~ ~");
        }
    }
}
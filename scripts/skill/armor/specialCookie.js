import { skillBase } from "../skillBase";

export class specialCookieSkill extends skillBase {
    constructor() {
        super();
        this.id = "§6スペシャルクッキー";
        this.cooldown = 0;
    }

    execute(player) {
        const container = player.getComponent("inventory").container;
        const selectedIndex = player.selectedSlotIndex;
        const item = container.getItem(selectedIndex);

        if (item) {
            if (item.amount > 1) {
                item.amount -= 1;
                container.setItem(selectedIndex, item);
            } else {
                container.setItem(selectedIndex, undefined);
            }
        }

        const pos = player.location;
        const dimension = player.dimension;

        dimension.playSound("random.eat", pos);
        dimension.playSound("random.potion.brewed", pos);
        dimension.spawnParticle("rca:arrow_gray", { x: pos.x, y: pos.y, z: pos.z });

        player.addEffect("instant_health", 1, { amplifier: 255, showParticles: true });
        player.addEffect("saturation", 1, { amplifier: 255, showParticles: true });
        player.addEffect("resistance", 72000, { amplifier: 0, showParticles: true });

        player.sendMessage("§6スペシャルパワー!!!");
    }
}
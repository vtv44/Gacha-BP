import { skillBase } from "../skillBase";

export class magicTechGunSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§b=魔銃剣= ディエゴ・ラ・イーフォルト"
        this.cooldown = 15 * 20
    }

    execute(player) {
        const dimension = player.dimension
        if (this.hasGun(player)) {
            this.onCooldown(player)
        }
    }

    hasGun(player) {
        const item = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex).getItem()
        return (item.typeId === "gacha:magic_tech_gun")
    }
}
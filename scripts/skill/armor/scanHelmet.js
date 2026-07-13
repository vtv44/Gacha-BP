import { system, world } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

export class scanHelmetSkill extends tickSkillBase {
    constructor() {
        super()

        this.id = "§5スキャンヘルメット"
        this.cooldown = 45 * 20
    }

    cooldownMessage(player) {

    }

    equip(player) {
        if (!this.canUse(player)) return

        const dimension = player.dimension
        const pos = player.location

        this.onCooldown(player)

        const targets = this.getTargets(player, pos, 15)

        dimension.spawnParticle("gacha:blue_volt", pos)
        dimension.playSound("block.enchanting_table.use", pos)

        for (const t of targets) {
            if (t.nameTag === t.name) continue

            t.nameTag = t.name
            t.sendMessage(`§l${player.name}によってネームタグを表示させられた`)
            t.playSound("mob.skeleton.death", {volume: 0.8, pitch: 0.7})
        }

        system.runTimeout(() => {
            if (!world.getDynamicProperty("game")) return

            player.nameTag = ""

            for (const t of targets) {
                if (!t.isValid) continue

                t.nameTag = ""
                t.playSound("mob.skeleton.death", {volume: 0.8, pitch: 1.4})
            }
        }, 15 * 20)
    }
}
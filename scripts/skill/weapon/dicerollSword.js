import { EntityDamageCause, system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class dicerollSwordSkill extends skillBase {
    constructor() {
        super()

        this.id = "§5サイコロソード"
        this.cooldown = 10 * 20
    }

    onDamage(player, event) {
        if (!this.canUse(player)) return;
        this.onCooldown(player)

        const hurtEntity = event.hurtEntity
        const dice = Math.floor(Math.random() * 5) + 1

        player.addEffect("slowness", 30)
        player.playSound("custom.diceroll")
        player.onScreenDisplay.setActionBar("§l- DICEROLL -")

        system.runTimeout(() => {
            if (!hurtEntity.isValid) return
            player.playSound("random.orb", {pitch: 2})
            player.onScreenDisplay.setActionBar(`§l- §g${dice} §f-`)
            hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~~1.4~")

            hurtEntity.applyDamage(dice, {cause: EntityDamageCause.none})
        }, 30)
    }
}
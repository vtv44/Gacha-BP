import { EntityDamageCause, GameMode, system, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class bailoutChestPlate extends skillBase {
    constructor() {
        super()

        this.id = "§5緊急脱出胸当て",
        this.cooldown = 180 * 20
    }

    cooldownMessage(player) {}

    onHurtBefore(player, event) {
        if (!this.canUse(player)) return

        const {damage, damageSource} = event
        const dimension = player.dimension
        const pos = player.location

        const health = player.getComponent("health")
        const current = health.currentValue
        const max = health.effectiveMax

        if (current - damage < 0 && damageSource.cause === EntityDamageCause.entityAttack) {
            event.cancel = true

            this.onCooldown(player)
            
            const players = world.getAllPlayers()
            .filter((p) => p.id !== player.id && p.getGameMode() !== GameMode.spectator)
            const rand = Math.floor(Math.random() * players.length)
            const p = players[rand]

            system.run(() => {
                player.teleport(p.location)
                p.teleport(pos)

                player.sendMessage("§l緊急脱出！  別のプレイヤーと位置が入れ替わった！")

                dimension.spawnParticle("minecraft:witchspell_emitter", pos)
                dimension.playSound("mob.endermen.portal", pos)

                player.playSound("random.fizz")

                health.setCurrentValue(max / 4)
            })
        }
    }
}
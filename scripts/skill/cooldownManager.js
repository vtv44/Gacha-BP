import { system } from "@minecraft/server";

export class CooldownManager {
    static cooldowns = new Map();

    static getKey(player, skillId) {
        return `${player.id}:${skillId}`
    }

    static has(player, skillId) {
        const key = this.getKey(player, skillId)
        const endTick = this.cooldowns.get(key)

        if (!endTick) return false

        return system.currentTick < endTick
    }

    static set(player, skillId, tick) {
        const key = this.getKey(player, skillId)

        this.cooldowns.set(
            key,
            system.currentTick + tick
        )
    }

    static getRemaining(player, skillId) {
        const key = this.getKey(player, skillId)
        const endTick = this.cooldowns.get(key)

        if (!endTick) return 0

        return Math.max(0, endTick - system.currentTick)
    }
}
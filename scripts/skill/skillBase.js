import { GameMode, ItemLockMode, ItemStack, system, world } from "@minecraft/server"
import { CooldownManager } from "./cooldownManager"

export class skillBase {
    constructor() {
        this.id = ""
        this.cooldown = 0
    }

    canAddEffect(player) {
        if (system.currentTick < player.getDynamicProperty("effectCancelTime")) {
            return false
        }
        return true
    }

    canUse(player) {
        if (CooldownManager.has(player, this.id)) {
            this.cooldownMessage(player)
            return false
        }

        return true
    }

    consumeItem(player) {
        // 手持ちのアイテムが一個だけ消えます
        const mainHand = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex)
        const item = mainHand.getItem()
        if (item.amount - 1 <= 0) {
            mainHand.setItem(null)
            return
        }
        const newItem = new ItemStack(item.typeId, item.amount - 1)
        newItem.nameTag = item.nameTag
        newItem.setLore(item.getLore() ? item.getLore() : null)
        newItem.lockMode = ItemLockMode.inventory
        mainHand.setItem(newItem)
    }
    
    cooldownMessage(player) {
        const cooltime = CooldownManager.getRemaining(player, this.id) / 20

        player.onScreenDisplay.setActionBar(
            `§cスキルは${cooltime}秒間使用できません`
        )
    }

    clearAllEffect(player) {
        for (const e of player.getEffects()) {
            const name = e.typeId

            if (name === "minecraft:health_boost") continue
            player.removeEffect(name)
        }
    }

    clearEffectSetTime(player, tick) {
        player.addEffect("village_hero", tick, {showParticles: false})
        player.setDynamicProperty("effectCancelTime", system.currentTick + tick)
        player.sendMessage(` \n§l${tick / 20}秒間、エフェクトが付与されなくなった\n `)
        player.playSound("note.bit", {pitch: 0.5})
    }

    execute(player) {}

    getTargets(player, location, maxDis, minDis = 0, exclude = true) {
        let teamScore = -1
        try {
            teamScore = world.scoreboard.getObjective("team").getScore(player)
        } catch {
            teamScore = -1
        }

        return player.dimension.getPlayers({
            location: location,
            maxDistance: maxDis,
            minDistance: minDis,
            scoreOptions: [{
                objective: "team",
                minScore: teamScore,
                maxScore: teamScore,
                exclude: exclude
            }],
            excludeGameModes: [GameMode.Spectator],
        })
    }

    onCooldown(player, ct = this.cooldown) {
        CooldownManager.set(player, this.id, ct)
    }

    onDamage(player, event) {}
    onHurt(player, event) {}
    onHurtBefore(player, event) {}
    use(player, event) {
        if (!this.canUse(player)) return

        this.execute(player)
    }
}

export class tickSkillBase extends skillBase {
    constructor() {
        super()
    }

    has(player) {}
    equip(player) {}
}
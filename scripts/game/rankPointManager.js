import { world } from "@minecraft/server"

export class rankPointManager {
    static rankPoint = [
        {point: -1, rank: "§l§a[ADMIN]§r§a"},
        {point: 500, rank: "§8[IRON]§r"},
        {point: 1500, rank: "§n[BRONZE]§r"},
        {point: 4000, rank: "§7[SILVER]§r"},
        {point: 7000, rank: "§g[GOLD]§r"},
        {point: 12500, rank: "§s[PLATINUM]§r"},
        {point: 20000, rank: "§b[DIAMOND]§r"},
        {point: 30000, rank: "§q[ASCENDANT]§r"},
        {point: 50000, rank: "§4[IMMORTAL]§r"},
        {point: 100000, rank: "§l§e[RADIANT§f+§e]§r"},
        {point: 300000, rank: "§l§e[RADIANT§f++§e]§r"},
        {point: 9999999, rank: "§l§e[RADIANT§f+++§e]§r"},
    ]
    
    static rankConfirm(player) {
        const rp = player.getDynamicProperty("rp")
        for (let i = 0; i <= this.rankPoint.length - 1; i++) {
            const r = this.rankPoint[i]
            if (r.point < rp) continue

            player.nameTag = (`${r.rank} ${player.name}§r`)
            return
        }
    }

    static rankPointAdd(player, point) {
        const rp = player.getDynamicProperty("rp")
        player.setDynamicProperty("rp", rp + point)
    }
}
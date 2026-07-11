import { world } from "@minecraft/server"

export class rankPointManager {
    static rankPoint = [
        {point: -1, rank: "§l§a[ADMIN]§r§a"},
        {point: 300, rank: "§8[IRON-I]§r"},
        {point: 700, rank: "§8[IRON-II]"},
        {point: 1100, rank: "§8[IRON-III]"},
        {point: 1500, rank: "§n[BRONZE-I]§r"},
        {point: 2250, rank: "§n[BRONZE-II]§r"},
        {point: 3000, rank: "§n[BRONZE-III]§r"},
        {point: 4000, rank: "§7[SILVER-I]§r"},
        {point: 5000, rank: "§7[SILVER-II]§r"},
        {point: 6000, rank: "§7[SILVER-III]§r"},
        {point: 7000, rank: "§g[GOLD-I]§r"},
        {point: 8500, rank: "§g[GOLD-II]§r"},
        {point: 10500, rank: "§g[GOLD-III]§r"},
        {point: 12500, rank: "§s[PLATINUM-I]§r"},
        {point: 15000, rank: "§s[PLATINUM-II]§r"},
        {point: 17500, rank: "§s[PLATINUM-III]§r"},
        {point: 20000, rank: "§b[DIAMOND-I]§r"},
        {point: 23500, rank: "§b[DIAMOND-II]§r"},
        {point: 27000, rank: "§b[DIAMOND-III]§r"},
        {point: 30000, rank: "§q[ASCENDANT-I]§r"},
        {point: 37500, rank: "§q[ASCENDANT-II]§r"},
        {point: 42000, rank: "§q[ASCENDANT-III]§r"},
        {point: 50000, rank: "§4[IMMORTAL-I]§r"},
        {point: 65000, rank: "§4[IMMORTAL-II]§r"},
        {point: 80000, rank: "§4[IMMORTAL-III]§r"},
        {point: 100000, rank: "§l§e[RADIANT§f+§e]§r"},
        {point: 300000, rank: "§l§e[RADIANT§f++§e]§r"},
        {point: 9999999, rank: "§l§f[§qVCT §eWINNER§f]§r"},
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
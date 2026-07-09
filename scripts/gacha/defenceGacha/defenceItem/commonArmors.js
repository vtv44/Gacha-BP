export const commonArmors = [
    {
        amount: 1,
        id: "minecraft:leather_helmet",
        name: "§f堅牢の頭",
        lore: [
            "§e[防御の構え] §5スニーク",
            "スニーク中自身に耐性1を与える"
        ],
    },
    {
        amount: 1, 
        id: "minecraft:chainmail_helmet",
        name: "§fチェーンなヘルメット",
        lore: []
    },
    {
        amount: 1, 
        id: "minecraft:chainmail_chestplate",
        name: "§fチェーストプレート",
        lore: []
    },
    {
        amount: 1, 
        id: "minecraft:chainmail_leggings",
        name: "§fチェーンなレギンス",
        lore: []
    },
    {
        amount: 1, 
        id: "minecraft:chainmail_boots",
        name: "§fチェーンなブーツ",
        lore: []
    },
    {
        amount: 1,
        id: "minecraft:copper_leggings", 
        name: "ふきとばアーマー",
        lore: [
            "§f[カウンター] §5被弾",
            "§5自分を直接攻撃してきた相手を弾き飛ばす"
        ],
    },
    {
        amount: 1,
        id: "minecraft:leather_chestplate", 
        name: "§f着火胸当て",
        lore: [
            "§c[着火] §5被弾",
            "§5攻撃してきた相手をちょっとだけ燃やす"
        ],
        enchants: [
            {id: "protection", level: 2},
            {id: "unbreaking", level: 2}
        ]
    },
]
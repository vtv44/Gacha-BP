export const commonWeapons = [
    {
        amount: 1,
        id: "minecraft:stone_sword",
        name: "§f石の剣",
        lore: [
            "§5なんの変哲もない石の剣"
        ],
    },
    {
        amount: 1,
        id: "minecraft:wooden_sword",
        name: "§f燃え残った剣",
        lore: [
            "§c[炎の記憶] §5攻撃",
            "§5自分が燃えていたなら攻撃が強化される"
        ],
        enchants: [
            {id: "unbreaking", level: 3}
        ]
    },
    {
        amount: 1,
        id: "minecraft:stick",
        name: "§fふきとばソード",
        lore: [
            "§f[吹き飛ばし] §5攻撃",
            "§5攻撃した相手を上に吹き飛ばす（少し）"
        ],
    },
]
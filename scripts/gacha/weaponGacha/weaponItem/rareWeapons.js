import { EnchantmentTypes } from "@minecraft/server";

export const rareWeapons = [
    {
        amount: 1,
        id: "minecraft:iron_sword",
        name: "§1英雄の剣",
        lore: [
            "§f[踏み込んだ一撃] §5右クリック",
            "§5前方に斬撃を二度放ってから突進する"
        ],
    },

    {
        amount: 1,
        id: "minecraft:stone_sword",
        name: "§1エンチャントされた石の剣",
        lore: [],
        enchants: [
            {
                id: "sharpness",
                level: 2
            },
            {
                id: "knockback",
                level: 2
            }
        ]
    },
    
    {
        amount: 1,
        id: "",
        name: "",
        lore: [],
    },
]
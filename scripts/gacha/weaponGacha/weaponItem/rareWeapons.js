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
            {id: "sharpness", level: 2},
            {id: "knockback", level: 2}
        ]
    },
    
    {
        amount: 1,
        id: "minecraft:golden_sword",
        name: "§1サンダーソード",
        lore: [
        "§e[天の憤怒] §5攻撃",
        "§5敵を攻撃した時天の怒りが呼び覚まされ相手を上方向に強く吹き飛ばし雷を落とす"
        ],
    },
    {
        amount: 1,
        id: "gacha:wheat_weapon",
        name: "§1麦麦ソード",
        lore: [
        "§6[豊穣] §5右クリック 攻撃",
        "§5攻撃した相手の満腹度を回復する",
        "§5右クリックで麦麦ソードをかじれる"
        ],
    },
    {
        amount: 1,
        id: "minecraft:wooden_axe",
        name: "§1ぼろぼろの斧",
        lore: [
        "§f[???] §5攻撃",
        "§5力を示すことで進化する。"
        ],
            enchants: [
            {id: "sharpness", level: 3},
            {id: "unbreaking", level: 2}
        ]
    },
    {
        amount: 1,
        id: "gacha:deadbush_weapon",
        name: "§1枯れ枯れソード",
        lore: [
            "§1[飢餓] §5攻撃",
            "§5攻撃した相手に空腹効果を与える",
            "§5周囲6ブロック内に敵がいた場合空腹状態にし、自身の満腹度を全回復する",
            "§5敵がいなかった場合回復しない"
        ],
    },
    {
        amount: 1,
        id: "minecraft:iron_sword",
        name: "§1衝撃的な剣",
        lore: [
            "§g[金色のハート] §5攻撃",
            "§5攻撃するたびに一時的な体力を得る"
        ],
    },
]
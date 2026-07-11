export const legendaryArmors = [
    {
        amount: 1,
        id: "minecraft:golden_leggings",
        name: "§6泥棒の脚甲",
        lore: [
            "§g[素早い盗み] §5被弾",
            "§5攻撃してきた相手が手に持っているものを盗む",
            "§5盗みに成功した時、破壊される"
        ],
        enchants: [
            {id: "protection", level: 4}
        ]
    },

    {
        amount: 1,
        id: "minecraft:golden_chestplate",
        name: "§6トーテムチェストプレート",
        lore: [
            "§a[不死] §5被弾",
            "§5攻撃を受けて体力が6以下になると発動",
            "§5体力を全回復し、10秒間無敵になる",
            "§5発動後、この防具は破壊される"
        ],
        enchants: [
            {id: "protection", level: 3},
            {id: "unbreaking", level: 3},
        ]
    },

    {
        amount: 1,
        id: "minecraft:diamond_leggings",
        name: "§6不完全な反射脚",
        lore: [
            "§d[リフレクト] §5被弾",
            "§5攻撃を受けたとき、受けたダメージの四分の一を反射する",
        ],
        enchants: [
            {id: "thorns", level: 3},
            {id: "unbreaking", level: 3},
        ]
    },
    {
        amount: 1,
        id: "gacha:proteikos_chestplate",
        name: "§6プロテコスチェストプレート",
        lore: [
            "§6[不安定な体] §5装備",
            "§5体力が50%以上の時、攻撃的なバフが付与される",
            "§549%未満の時は防御的なバフに変更される"
        ],
    },
    {
        amount: 3,
        id: "gacha:special_cookie",
        name: "§6スペシャルクッキー！",
        lore: [
            "§6[YUMMY] §5食事 素材",
            "§5食べると体力と満腹度が全回復し耐性が付与される",
            "§5作業台で防具も作れる"
        ],
    },
    {
        amount: 3,
        id: "gacha:prism",
        name: "§6輝くプリズム",
        lore: [
            "§e[キラキラ] §5素材",
            "§5作業台で防具も作れる"
        ],
    }
    
]
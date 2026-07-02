export const mythicWeapons = [

    {
        amount: 1,
        id: "minecraft:breeze_rod",
        name: "§d=魔術銃= レボルブ",
        lore: [
            "§1[魔術の弾丸] §5右クリック",
            "的中時、対象に炎上6を付与する",
            "使用後、弾丸が無いなら体力を1減少させ再装填する"
        ],
    },

    {
        amount: 1,
        id: "minecraft:golden_sword",
        name: "§dファントムソード",
        lore: [
            "§d[ファントム] §5右クリック",
            "§51秒間スペクテイターになる"
        ],
    },

    {
        amount: 1,
        id: "minecraft:netherite_sword",
        name: "§d地獄の大剣",
        lore: [
            "§4[地獄の罰] §5右クリック",
            "§5前方直線範囲に壁貫通の強力なダメージを与える"
        ],
        enchants: [
            {id: "unbreaking", level: 3},
            {id: "fire_aspect", level: 2}
        ]
    },
    {   
        amount: 1,
        id: "gacha:breaker",
        name: "§dブレイカー",
        lore: [
            "§u[変形] §5右クリック 攻撃",
            "§5右クリックで§dクラッシャー§5に変形",
            "§5この武器による採掘はブロックを即座に破壊する"
        ]
    },
]
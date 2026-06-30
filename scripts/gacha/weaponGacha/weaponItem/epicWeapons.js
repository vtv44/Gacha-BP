export const epicWeapons = [
    {
        amount: 1,
        id: "minecraft:stone_axe",
        name: "§5爆裂斧",
        lore: [
            "§c[レイジバウンド] 右クリック",
            "力を溜めて前方に爆発を起こす"
        ],
        enchants: [
            {id: "sharpness", level: 3},
            {id: "knockback", level: 1},
            {id: "unbreaking", level: 2}
        ]
    },
    {
        amount: 1,
        id: "minecraft:wooden_sword",
        name: "§5カースソード",
        lore: [
            "§4[呪い] §5攻撃",
            "§5殴った相手に毒、ウィザー、炎のどれかが付与される。"
        ],
    },
    {
        amount: 1,
        id: "gacha:dice_sword",
        name: "§5サイコロソード",
        lore: [
            "§4[ダメージボーナス] §5攻撃",
            "§5攻撃後、1~6のランダムなダメージボーナスを受ける"
        ],
    },
    {
        amount: 1,
        id: "gacha:affect_sword",
        name: "§5影響の剣",
        lore: [
            "§4[作用の反動] §5攻撃",
            "§5攻撃後、相手に付与されているエフェクトの数分追加ダメージを与える"
        ],
    },
]
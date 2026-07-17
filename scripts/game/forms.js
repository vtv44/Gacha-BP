import { world } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { game } from "./game"

export class forms {
    static coinForm() {
        const form = new ActionFormData()
        .title("コインの配布")
        .body("配布方法を選択してください")
        .button("全員")
        .button("個人")
        .button("全員リセット")
        
        return form
    }

    static coinConfirmForm() {
        const form = new ModalFormData()
        .title("コインの配布")
        .textField("配布する金額を設定してください", "")

        return form
    }

    static gachaForm(player) {
        const coin = world.scoreboard.getObjective("coin").getScore(player)

        const form = new ActionFormData()
        .title("§l引くガチャを選択してください")
        .body(`§l所持しているコイン: §e${coin}`)
        .button("§l§cWEAPON")
        .button("§l§bDEFENCE")
        .button("§l§aMAGIC")

        return form
    }

    static gameForm() {
        const form = new ActionFormData()
        .title("ゲーム")
        .button("ゲーム開始")
        .button("ゲーム設定")
        .button("チーム決定")
        .button("ゲームリセット")

        return form
    }

    static gameSettingForm() {
        const form = new ModalFormData()
        .title("ゲーム設定")
        .dropdown("初期体力", ["20", "40", "60"])
        .dropdown("範囲開始の時間", ["300", "580", "480", "180", "0"])
        .dropdown("範囲によるダメージ量", ["3", "10", "7", "5", "2", "1"])

        return form
    }

    static maps() {
        const form = new ActionFormData()
        .title("マップ")
        .button("ザ・エンド")
        .button("学校")
        .button("廃塚")

        return form
    }

    static playersForm(players) {
        // ワールドにいるプレイヤー全員
        const form = new ActionFormData()
        .title("プレイヤー")
        for (const p of players) {
            form.button(p.name)
        }

        return form
    }

    static shopForm(player) {
        let coin = 0
        try {
            coin = world.scoreboard.getObjective("coin").getScore(player)
        } catch(e) {
            coin = 0
        }

        const form = new ActionFormData()
        .title("§l§eショップ！")
        .body(`§l所持しているコインは§e${coin}コイン§r§lです`)
        .button("§lガラス32個 §e5コイン", "textures/blocks/glass")
        .button("§l金のニンジン8個 §e5コイン", "textures/items/carrot_golden")
        .button("§lステーキ32個 §e15コイン", "textures/items/beef_cooked")
        .button("§lテレポート2個 §e5コイン", "textures/items/amethyst_shard")

        return form
    }

    static rankPointForm() {
        const form = new ActionFormData()
        .title("ランクポイントの設定")
        .button("ランクポイントの付与")
        .button("ランクポイントの消去")
        .button("ランクポイントの表示")
        .button("権限者になる")

        return form
    }

    static addRankPointForm() {
        const form = new ModalFormData()
        .title("ランクポイントの付与")
        .textField("付与するランクポイントを入力してください", "")

        return form
    }
}


import { world } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"

export class forms {
    static coinForm() {
        const form = new ActionFormData()
        .title("コインの配布")
        .body("配布方法を選択してください")
        .button("全員")
        .button("個人")
        
        return form
    }

    static coinConfirmForm() {
        const form = new ModalFormData()
        .title("コインの配布")
        .textField("配布する金額を設定してください", "")

        return form
    }

    static playersForm() {
        // ワールドにいるプレイヤー全員
        const players = world.getAllPlayers()
        const form = new ActionFormData()
        for (const p of players) {
            form.button(p.name)
        }

        return form
    }
}
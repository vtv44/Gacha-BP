import { skillBase } from "../skillBase";

export class assaultArmorSkill extends skillBase {
    constructor() {
        super();
        this.id = "§d突撃アーマー"; 
    }

    // 🛡️ main.js が 5tick ごとに呼び出しに来た時のエラー（not a function）を防ぐためのダミー処理
    equip(player) {
        // ここでは何もしない（エラー防止用）

        // tickSkillBaseを継承していないので、これが呼び出されることはない+tickSkillBaseの方で同じことをしている
    }

    // ⚔️ 実際にダメージを受けた瞬間にノックバックをかき消す処理
    onHurt(player, event) {
        try {
            player.clearVelocity();
        } catch (e) {
            // エラー回避
        }
    }
}
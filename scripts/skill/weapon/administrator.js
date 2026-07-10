import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { skillBase } from "../skillBase";

const quizList = [
    { q: "JavaScriptで変数を宣言するキーワードではないものは？", options: ["let", "const", "var", "def"], correct: 3 },
    { q: "「==」と「===」の違いとして正しいのは？", options: ["違いはない", "「===」は型も厳密に比較する", "「==」の方が処理が遅い", "「==」は存在しない"], correct: 1 },
    { q: "配列の一番最初の要素のインデックス（番号）は？", options: ["0", "1", "-1", "null"], correct: 0 },
    { q: "JavaScriptでコンソールに文字を表示するメソッドは？", options: ["print()", "System.out.print()", "console.log()", "echo()"], correct: 2 },
    { q: "Pythonで関数を定義するキーワードは？", options: ["function", "def", "func", "define"], correct: 1 },
    { q: "プログラムのバグ（不具合）を見つけて修正する作業を何という？", options: ["デプロイ", "コンパイル", "リファクタリング", "デバッグ"], correct: 3 },
    { q: "「ループ処理（繰り返し）」を行うためのキーワードは？", options: ["if", "for", "switch", "class"], correct: 1 },
    
    { q: "HTMLは何の略？", options: ["Hyper Text Markup Language", "Hyper Tool Multi Language", "High Text Machine Language"], correct: 0 },
    { q: "CSSは何の略？", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System"], correct: 1 },
    { q: "HTTPステータスコード「404」の意味は？", options: ["サーバーエラー", "認証失敗", "見つからない (Not Found)", "リクエスト成功"], correct: 2 },
    { q: "データベースからデータを取得するSQLコマンドは？", options: ["GET", "FETCH", "PULL", "SELECT"], correct: 3 },
    { q: "GitHubの主な目的は？", options: ["チャットツール", "バージョン管理", "画像編集", "Webホスティング"], correct: 1 },
    
    { q: "Minecraftの統合版アドオン開発で主に使われるプログラミング言語は？", options: ["Python", "C++", "JavaScript", "Java"], correct: 2 },
    { q: "マイクラのコマンドで、一番近いプレイヤーを指すセレクターは？", options: ["@a", "@r", "@s", "@p"], correct: 3 },
    { q: "マイクラで「1秒」は何ティック（Tick）？", options: ["10", "20", "60", "100"], correct: 1 }
];

export class administratorSkill extends skillBase {
    constructor() {
        super();
        this.id = "§4administrator";
        this.cooldown = 0 * 0; 
    }

    async execute(player) {
        const players = world.getAllPlayers();
        const teamScore = world.scoreboard.getObjective("team");

        const validTargets = players.filter(p => {
            if (p.id === player.id) return false; 
            
            if (teamScore) {
                try {
                    const myTeam = teamScore.getScore(player);
                    const targetTeam = teamScore.getScore(p);
                    if (myTeam !== undefined && targetTeam !== undefined && myTeam === targetTeam) {
                        return false;
                    }
                } catch (e) {}
            }
            return true;
        });

        if (validTargets.length === 0) {
            player.sendMessage("§c[システム] クイズを出せる敵がいません。");
            return;
        }

        const form = new ActionFormData()
            .title("§aターゲット選択")
            .body("プログラミングクイズを送りつける相手を選んでください。");

        for (const target of validTargets) {
            form.button(target.nameTag || target.name);
        }

        try {
            const res = await form.show(player);
            if (res.canceled) return;

            const selectedTarget = validTargets[res.selection];
            
            this.onCooldown(player);
            player.sendMessage(`§a[スキル] §e${selectedTarget.nameTag} §fにクイズを送信しました！`);
            
            this.sendQuiz(player, selectedTarget);

        } catch (e) {
            player.sendMessage("§c[システム] メニューを開けませんでした。立ち止まって再度お試しください。");
        }
    }

    async sendQuiz(attacker, target) {
        const quiz = quizList[Math.floor(Math.random() * quizList.length)];

        const form = new ActionFormData()
            .title("§cハッキング検知！")
            .body(`§e${attacker.nameTag} §fからのハッキング攻撃！\n防ぐには以下のクイズに正解しろ！\n\n§b【問題】\n${quiz.q}\n\n§7※間違える、または画面を閉じるとダメージ！`);

        for (const option of quiz.options) {
            form.button(option);
        }

        target.sendMessage("§c[警告] 画面にクイズが表示されます！急いで解答してください！");
        target.dimension.playSound("random.toast", target.location, { volume: 1.0, pitch: 1.0 });
        
        await new Promise(resolve => system.runTimeout(resolve, 20));

        try {
            if (!target.isValid) return;

            const res = await form.show(target);

            if (res.canceled) {
                this.punishTarget(attacker, target, "クイズから逃亡した");
                return;
            }

            if (res.selection === quiz.correct) {
                target.sendMessage("§a[正解] ハッキングの防御に成功しました！");
                target.dimension.playSound("random.levelup", target.location, { volume: 1.0, pitch: 1.0 });
                attacker.sendMessage(`§c[失敗] ${target.nameTag} にクイズを解かれ、攻撃が防がれました！`);
            } else {
                this.punishTarget(attacker, target, "クイズに間違えた");
            }

        } catch (e) {
            this.punishTarget(attacker, target, "エラー/応答不能だった");
        }
    }

    punishTarget(attacker, target, reason) {
        target.sendMessage(`§c[失敗: ${reason}] ハッキングが完了し、大ダメージを受けた！`);
        target.dimension.playSound("random.explode", target.location, { volume: 1.0, pitch: 1.0 });
        
        target.applyDamage(5, {
            cause: "entityAttack",
            damagingEntity: attacker
        });

        attacker.sendMessage(`§a[成功] ${target.nameTag} が${reason}ため、ダメージを与えました！`);
    }
}
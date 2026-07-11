import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

// ▼ skillBase は1つ上なので "../"
import { skillBase } from "../skillBase";

// ▼ game.js は2つ上（scripts階層）にあるので "../../" にする！
import { game } from "../../game/game";

export class teleportSkill extends skillBase {
    constructor() {
        super();
        this.id = "§eテレポート";
        this.cooldown = 0;
    }

    async execute(player) {
        const players = world.getAllPlayers();
        const teamScore = world.scoreboard.getObjective("team");

        const validTargets = players.filter(p => {
            if (p.id === player.id) return false; 
            
            if (!game.testJoinGame(p)) return false; 

            if (teamScore) {
                try {
                    const myTeam = teamScore.getScore(player);
                    const targetTeam = teamScore.getScore(p);
                    if (myTeam !== undefined && targetTeam !== undefined && myTeam === targetTeam) {
                        return true;
                    }
                } catch (e) {}
            }
            return false;
        });

        if (validTargets.length === 0) {
            player.sendMessage("§c[システム] テレポート可能な生存している味方がいません。");
            player.playSound("note.bass");
            return;
        }

        if (validTargets.length === 1) {
            this.doTeleport(player, validTargets[0]);
            return;
        }

        const form = new ActionFormData()
            .title("§aテレポート先選択")
            .body("合流したい味方を選んでください。");

        for (const target of validTargets) {
            form.button(target.nameTag || target.name);
        }

        try {
            const res = await form.show(player);
            if (res.canceled) return;

            const selectedTarget = validTargets[res.selection];
            this.doTeleport(player, selectedTarget);

        } catch (e) {
            player.sendMessage("§c[システム] メニューを開けませんでした。立ち止まって再度お試しください。");
        }
    }

    doTeleport(player, target) {
        if (!target || !target.isValid || !game.testJoinGame(target)) {
            player.sendMessage("§c対象のプレイヤーは既にキルされたか、ワールドにいません。");
            player.playSound("note.bass");
            return;
        }

        this.consumeItem(player);
        player.teleport(target.location);
        player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.0 });
        player.sendMessage(`§a${target.nameTag || target.name} の元へテレポートしました！`);

        this.onCooldown(player);
    }
}
import { skillBase } from "../skillBase";

export class wheatSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§6麦麦/枯れ枯れ切り替え";
        this.cooldown = 20 * 10; //
        this.isWheatMode = new Map();
    }

    execute(player) {
        const currentMode = this.isWheatMode.get(player.name) ?? true;
        const nextMode = !currentMode;
        this.isWheatMode.set(player.name, nextMode);

        const displayName = nextMode ? "§1麦麦ソード" : "§1枯れ枯れソード";
        player.sendMessage(`モードを ${displayName} に切り替えました！`);
        player.dimension.playSound("random.click", player.location, { volume: 0.5, pitch: 1.2 });
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        if (!target || !target.isValid) return;

        const isWheat = this.isWheatMode.get(player.name) ?? true;

        if (isWheat) {
            target.runCommand("effect @s saturation 1 1 true");
            target.dimension.playSound("random.orb", target.location, { volume: 0.5, pitch: 0.8 });
        } else {
            target.runCommand("effect @s hunger 5 2 true");
            target.dimension.playSound("mob.zombie.infect", target.location, { volume: 0.5, pitch: 1.5 });
        }
    }
}
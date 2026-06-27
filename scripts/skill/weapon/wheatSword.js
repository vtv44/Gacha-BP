import { skillBase } from "../skillBase";

export class wheatSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1麦麦ソード";
        this.cooldown = 10 * 20;
    }

    execute(player) {
        player.addEffect("saturation", 20, { amplifier: 254, showParticles: false });
        
        player.sendMessage("§6おいしい！");
        
        player.dimension.playSound("random.eat", player.location, { volume: 1.0, pitch: 1.0 });
        
        this.onCooldown(player);
    }

    onDamage(player, event) {
        event.hurtEntity.runCommand("effect @s saturation 1 0 true");
    }
}
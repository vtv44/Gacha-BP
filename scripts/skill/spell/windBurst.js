import { skillBase } from "../skillBase";

export class windBurstSkill extends skillBase {
    constructor() {
        super();
        this.id = "§aウィンドバースト"; 
        this.cooldown = 20 * 15; 
    }

    execute(player) {
        const centerLoc = { ...player.location };
        const radius = 5;

        const targets = this.getTargets(player, centerLoc, radius).filter(t => t !== player);

        let hitCount = 0;

        for (const target of targets) {
            if (!target.isValid) continue;

            const dx = target.location.x - centerLoc.x;
            const dz = target.location.z - centerLoc.z;

            const distance = Math.sqrt(dx * dx + dz * dz);
            
            let dirX = 0;
            let dirZ = 0;

            if (distance > 0) {
                dirX = dx / distance;
                dirZ = dz / distance;
            } else {
                dirX = Math.random() - 0.5;
                dirZ = Math.random() - 0.5;
            }

            const horizontalPower = 3.0; 
            const verticalPower = 0.8;   

            try {
                target.applyKnockback({ x: dirX * horizontalPower, z: dirZ * horizontalPower }, verticalPower);
                hitCount++;
            } catch (e) {}
        }

        player.runCommand("playsound mob.enderdragon.flapan @a ~ ~ ~ 1 0.5");
        player.runCommand("playsound random.explode @a ~ ~ ~ 0.5 1.5");
        
        try {
            player.runCommand(`particle rca:magic_circle_2_large ${centerLoc.x} ${centerLoc.y + 0.1} ${centerLoc.z}`);
        } catch(e) {}

        if (hitCount > 0) {
            player.sendMessage(`§a[スキル] §fウィンドバースト！ ${hitCount}人の敵を吹き飛ばした！`);
        } else {
            player.sendMessage("§a[スキル] §7周囲に吹き飛ばせる対象がいませんでした。");
        }

        this.onCooldown(player);
    }
}
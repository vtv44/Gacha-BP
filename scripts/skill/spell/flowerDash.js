import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class flowerDashSkill extends skillBase {
    constructor() {
        super();
        this.id = "§5フラワーダッシュ";
        this.cooldown = 30 * 20;
    }

    execute(player) {
        const duration = 10 * 20;

        if (this.canAddEffect(player)) {
            player.addEffect("speed", duration, { amplifier: 14, showParticles: false });
            player.addEffect("resistance", duration, { amplifier: 0, showParticles: false });
            player.addEffect("jump_boost", duration, { amplifier: 0, showParticles: false });
            player.addEffect("strength", duration, { amplifier: 0, showParticles: false });
            player.addEffect("fire_resistance", duration, { amplifier: 0, showParticles: false });
            player.addEffect("night_vision", duration, { amplifier: 0, showParticles: false });
            player.addEffect("regeneration", duration, { amplifier: 0, showParticles: false });
            player.addEffect("water_breathing", duration, { amplifier: 0, showParticles: false });
            player.addEffect("wind_charged", duration, { amplifier: 0, showParticles: false });
            player.addEffect("infested", duration, { amplifier: 0, showParticles: false });
            player.addEffect("weaving", duration, { amplifier: 0, showParticles: false });
            player.addEffect("haste", duration, { amplifier: 0, showParticles: false });
            player.addEffect("oozing", duration, { amplifier: 0, showParticles: false });
            player.addEffect("mining_fatigue", duration, { amplifier: 0, showParticles: false });
            player.addEffect("health_boost", duration, { amplifier: 0, showParticles: false });
            player.addEffect("absorption", duration, { amplifier: 0, showParticles: false });
            player.addEffect("bad_omen", duration, { amplifier: 0, showParticles: false });
            player.addEffect("raid_omen", duration, { amplifier: 0, showParticles: false });
            player.addEffect("trial_omen", duration, { amplifier: 0, showParticles: false });
            player.addEffect("conduit_power", duration, { amplifier: 0, showParticles: false });
            player.addEffect("village_hero", duration, { amplifier: 0, showParticles: false });
        }

        player.sendMessage("§5フラワーダッシュ！！");

        try {
            player.dimension.playSound("block.chorus_flower.grow", player.location, { volume: 1.0, pitch: 1.0 });
            player.dimension.runCommandAsync(`particle minecraft:crop_growth_emitter ${player.location.x} ${player.location.y} ${player.location.z}`);
        } catch(e) {}

        let tickCount = 0;
        let lastLoc = { x: player.location.x, y: player.location.y, z: player.location.z };

        const intervalId = system.runInterval(() => {
            tickCount++;
            
            if (tickCount > duration || !player || !player.isValid) {
                system.clearRun(intervalId);
                return;
            }

            try {
                const currentLoc = player.location;
                const viewDir = player.getViewDirection();
                
                const len = Math.sqrt(viewDir.x * viewDir.x + viewDir.z * viewDir.z) || 1;
                const vX = viewDir.x / len;
                const vZ = viewDir.z / len;
                
                const bY = Math.floor(currentLoc.y - 1);
                
                for (let step = 0; step <= 2; step++) {
                    const bX = Math.floor(currentLoc.x + vX * step);
                    const bZ = Math.floor(currentLoc.z + vZ * step);
                    
                    for (let x = -1; x <= 1; x++) {
                        for (let z = -1; z <= 1; z++) {
                            const block = player.dimension.getBlock({ x: bX + x, y: bY, z: bZ + z });
                            if (block && block.isAir) {
                                block.setType("minecraft:hay_block");
                            }
                        }
                    }
                }

                const dx = currentLoc.x - lastLoc.x;
                const dz = currentLoc.z - lastLoc.z;

                if (Math.abs(dx) > 0.05 || Math.abs(dz) > 0.05) {
                    if (tickCount % 3 === 0) {
                        const pX = currentLoc.x - viewDir.x;
                        const pY = currentLoc.y;
                        const pZ = currentLoc.z - viewDir.z;
                        
                        player.dimension.spawnParticle("rca:afterimage_rainbow", { x: pX, y: pY, z: pZ });
                    }
                }
                
                lastLoc = { x: currentLoc.x, y: currentLoc.y, z: currentLoc.z };
            } catch(e) {}
        }, 1);

        this.onCooldown(player);
    }
}
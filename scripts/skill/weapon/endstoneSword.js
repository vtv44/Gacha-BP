import { skillBase } from "../skillBase";

export class endstoneSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§eエンドストーンソード";
        this.cooldown = 100;
    }

    execute(player, event) {
        this.onCooldown(player);

        const viewDir = player.getViewDirection();
        const headLoc = {
            x: player.location.x,
            y: player.location.y + 1.62,
            z: player.location.z
        };
        const maxDist = 8; 

        const raycast = player.dimension.getBlockFromRay(headLoc, viewDir, { maxDistance: maxDist });

        let tpLoc;
        if (raycast) {
            const hitDist = Math.sqrt(
                Math.pow(raycast.block.location.x - headLoc.x, 2) +
                Math.pow(raycast.block.location.y - headLoc.y, 2) +
                Math.pow(raycast.block.location.z - headLoc.z, 2)
            );
            
            const safeDist = Math.max(0, hitDist - 1.5); 
            
            tpLoc = {
                x: headLoc.x + viewDir.x * safeDist,
                y: (headLoc.y - 1.62) + viewDir.y * safeDist,
                z: headLoc.z + viewDir.z * safeDist
            };
        } else {
            tpLoc = {
                x: headLoc.x + viewDir.x * maxDist,
                y: (headLoc.y - 1.62) + viewDir.y * maxDist,
                z: headLoc.z + viewDir.z * maxDist
            };
        }

        player.teleport(tpLoc, { dimension: player.dimension });
        
        player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.0 });

        player.dimension.spawnParticle("minecraft:witchspell_emitter", player.location);
    }
}
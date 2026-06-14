import { system } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class wallSkill extends skillBase {
    constructor() {
        super();
        this.id = "§aウォール";
        this.cooldown = 30 * 20;
    }

    execute(player) {
        if (!player || !player.isValid) return;

        const pos = player.location;
        const viewDir = player.getViewDirection();
        const dimension = player.dimension;

        const feetBlock = dimension.getBlock({ x: pos.x, y: pos.y - 0.1, z: pos.z });
        if (!feetBlock || feetBlock.typeId === "minecraft:air") {
            player.sendMessage("§c空中では使用できません！");
            player.runCommand("playsound note.bass @s ~ ~ ~");
            return;
        }

        const angle = Math.atan2(viewDir.z, viewDir.x);

        const dirIndex = Math.round((angle * 4) / Math.PI + 8) % 8;

        let wallDir, spreadDir;

        switch (dirIndex) {
            case 0: // 東 (X+)
                wallDir = { x: 1, z: 0 };   spreadDir = { x: 0, z: 1 }; break;
            case 1: // 南東 (X+, Z+)
                wallDir = { x: 1, z: 1 };   spreadDir = { x: -1, z: 1 }; break;
            case 2: // 南 (Z+)
                wallDir = { x: 0, z: 1 };   spreadDir = { x: 1, z: 0 }; break;
            case 3: // 南西 (X-, Z+)
                wallDir = { x: -1, z: 1 };  spreadDir = { x: -1, z: -1 }; break;
            case 4: // 西 (X-)
                wallDir = { x: -1, z: 0 };  spreadDir = { x: 0, z: -1 }; break;
            case 5: // 北西 (X-, Z-)
                wallDir = { x: -1, z: -1 }; spreadDir = { x: 1, z: -1 }; break;
            case 6: // 北 (Z-)
                wallDir = { x: 0, z: -1 };  spreadDir = { x: -1, z: 0 }; break;
            case 7: // 北東 (X+, Z-)
                wallDir = { x: 1, z: -1 };  spreadDir = { x: 1, z: 1 }; break;
        }

        const baseX = Math.floor(pos.x) + wallDir.x;
        const baseY = Math.floor(pos.y);
        const baseZ = Math.floor(pos.z) + wallDir.z;

        const layers = [
            "minecraft:iron_block",
            "minecraft:glass",
            "minecraft:iron_block",
            "minecraft:glass",
            "minecraft:iron_block"
        ];

        layers.forEach((block, i) => {
            system.runTimeout(() => {
                try {
                    for (let s = -2; s <= 2; s++) {
                        const x = baseX + spreadDir.x * s;
                        const y = baseY + i;
                        const z = baseZ + spreadDir.z * s;
                        
                        const targetBlock = dimension.getBlock({ x, y, z });
                        if (targetBlock) {
                            targetBlock.setType(block);
                        }
                    }
                    dimension.runCommand(`playsound random.anvil_land @a ${baseX} ${baseY + i} ${baseZ}`);
                } catch (e) {
                }
            }, i * 5);
        });

        this.onCooldown(player);
    }
}
import { system } from "@minecraft/server";
import { tickSkillBase } from "../skillBase";

const regenCooldown = new Set();

export class regenerationChestPlateSkill extends tickSkillBase {
    constructor() {
        super();
                this.id = "§1リジェネレーションチェストプレート";
            }
        
            equip(player) {
                if (!this.canAddEffect(player)) return;
                if (regenCooldown.has(player.id)) return;
        
                player.addEffect("regeneration", 5 * 20, { amplifier: 0, showParticles: false });
                regenCooldown.add(player.id);
        
                system.runTimeout(() => {
                    regenCooldown.delete(player.id);
                }, 100);
            }
        }
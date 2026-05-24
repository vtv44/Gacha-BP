import { skillManager } from "./skillManager";
import { redMagicSkill } from "./spell/redMagicSkill";
import { scannerSkill } from "./spell/scanner";
import { drillRodSkill } from "./weapon/drillRod";
import { giantSwordSkill } from "./weapon/giant_sword";
import { heroSwordSkill } from "./weapon/heroSword";
import { ragingGravitySkill } from "./weapon/raging_gravity";

skillManager.register(new redMagicSkill())
skillManager.register(new giantSwordSkill())
skillManager.register(new heroSwordSkill())
skillManager.register(new drillRodSkill())
skillManager.register(new ragingGravitySkill())
skillManager.register(new scannerSkill())
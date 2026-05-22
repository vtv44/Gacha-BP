import { skillManager } from "./skillManager";
import { redMagicSkill } from "./spell/redMagicSkill";
import { drillRodSkill } from "./weapon/drillRod";
import { giantSwordSkill } from "./weapon/giant_sword";
import { heroSwordSkill } from "./weapon/heroSword";

skillManager.register(new redMagicSkill())
skillManager.register(new giantSwordSkill())
skillManager.register(new heroSwordSkill())
skillManager.register(new drillRodSkill())
import { skillManager } from "./skillManager";
import { redMagicSkill } from "./spell/redMagicSkill";
import { giantSwordSkill } from "./weapon/giant_sword";

skillManager.register(new redMagicSkill())
skillManager.register(new giantSwordSkill())
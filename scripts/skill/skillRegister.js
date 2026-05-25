import { skillManager } from "./skillManager";
import { heal_bookSkill } from "./spell/heal_book";
import { holyDimensionSkill } from "./spell/holy_Dimension";
import { redMagicSkill } from "./spell/redMagicSkill";
import { scannerSkill } from "./spell/scanner";
import { smokeBombSkill } from "./spell/smoke_bomb";
import { tntshotSkill } from "./spell/tnt_shot";
import { dashSlashSkill } from "./weapon/dash_sword";
import { drillRodSkill } from "./weapon/drillRod";
import { giantSwordSkill } from "./weapon/giant_sword";
import { heroSwordSkill } from "./weapon/heroSword";
import { phantomSwordSkill } from "./weapon/phantom_sword";
import { ragingGravitySkill } from "./weapon/raging_gravity";

skillManager.register(new redMagicSkill())
skillManager.register(new giantSwordSkill())
skillManager.register(new heroSwordSkill())
skillManager.register(new drillRodSkill())
skillManager.register(new ragingGravitySkill())
skillManager.register(new scannerSkill())
skillManager.register(new heal_bookSkill())
skillManager.register(new holyDimensionSkill())
skillManager.register(new tntshotSkill())
skillManager.register(new dashSlashSkill())
skillManager.register(new smokeBombSkill())
skillManager.register(new phantomSwordSkill())
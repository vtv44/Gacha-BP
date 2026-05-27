import { skillManager } from "./skillManager";
import { holyDimensionSkill } from "./spell/holy_Dimension";
import { ragingGravitySkill } from "./spell/ragingGravity";
import { redMagicSkill } from "./spell/redMagicSkill";
import { scannerSkill } from "./spell/scanner";
import { smokeBombSkill } from "./spell/smoke_bomb";
import { assaultLance } from "./weapon/assaultLance";
import { drillRodSkill } from "./weapon/drillRod";
import { giantSwordSkill } from "./weapon/giant_sword";
import { heroSwordSkill } from "./weapon/heroSword";
import { phantomSwordSkill } from "./weapon/phantom_sword";
import { healBookSkill } from "./spell/heal_book";
import { tntShotSkill } from "./spell/tnt_shot";
import { dashSwordSkill } from "./weapon/dash_sword";
import { magicRevolverSkill } from "./weapon/magicRevolver";

skillManager.register(new redMagicSkill())
skillManager.register(new giantSwordSkill())
skillManager.register(new heroSwordSkill())
skillManager.register(new drillRodSkill())
skillManager.register(new scannerSkill())
skillManager.register(new holyDimensionSkill())
skillManager.register(new smokeBombSkill())
skillManager.register(new phantomSwordSkill())
skillManager.register(new assaultLance())
skillManager.register(new ragingGravitySkill())
skillManager.register(new healBookSkill)
skillManager.register(new tntShotSkill())
skillManager.register(new dashSwordSkill())
skillManager.register(new magicRevolverSkill())
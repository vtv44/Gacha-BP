import { skillManager } from "./skillManager";
import { holyDimensionSkill } from "./spell/holy_Dimension";
import { ragingGravitySkill } from "./spell/ragingGravity";
import { redMagicSkill } from "./spell/redMagicSkill";
import { scannerSkill } from "./spell/scanner";
import { smokeBombSkill } from "./spell/smoke_Bomb";
import { assaultLance } from "./weapon/assaultLance";
import { drillRodSkill } from "./weapon/drillRod";
import { giantSwordSkill } from "./weapon/giant_Sword";
import { heroSwordSkill } from "./weapon/heroSword";
import { phantomSwordSkill } from "./weapon/phantom_Sword";
import { healBookSkill } from "./spell/heal_Book";
import { tntShotSkill } from "./spell/tnt_Shot";
import { dashSwordSkill } from "./weapon/dash_Sword";

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
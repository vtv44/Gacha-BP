import { skillManager } from "./skillManager";
import { holyDimensionSkill } from "./spell/holyDimension";
import { ragingGravitySkill } from "./spell/ragingGravity";
import { redMagicSkill } from "./spell/redMagicSkill";
import { scannerSkill } from "./spell/scanner";
import { smokeBombSkill } from "./spell/smokeBomb";
import { assaultLance } from "./weapon/assaultLance";
import { drillRodSkill } from "./weapon/drillRod";
import { giantSwordSkill } from "./weapon/giantSword";
import { heroSwordSkill } from "./weapon/heroSword";
import { phantomSwordSkill } from "./weapon/phantomSword";
import { healBookSkill } from "./spell/healBook";
import { tntShotSkill } from "./spell/tntShot";
import { dashSwordSkill } from "./weapon/dashSword";
import { magicRevolverSkill } from "./weapon/magicRevolver";
import { cosmicMeteorSkill } from "./weapon/cosmicMeteorSkill";
import { explosiveAxeSkill } from "./weapon/explosiveAxe";
import { speedBootsSkill } from "./armor/speedBoots";
import { harubaguSpecialCatalogSKill } from "./spell/harubaguSpecialCatalog";
import { highSpeedSkill } from "./spell/highSpeed";
import { deathNoteSkill } from "./spell/deathNote";
import { magicTechGunSwordSkill } from "./weapon/magicTechGunSword";
import { slowHelmetSkill } from "./armor/slowHelmet";
import { superSlowHelmetSkill } from "./armor/superSlowHelmet";
import { regenerationChestPlateSkill } from "./armor/regenerationChestPlate";
import { superRegenerationChestPlateSkill } from "./armor/superRegenerationChestPlate";
import { pushFeatherSkill } from "./spell/pushFeather";
import { leapFeatherSkill } from "./spell/leapFeather";
import { blueBirdOfHappinessSkill } from "./spell/blueBirdOfHappiness";
import { jammingSwordSkill } from "./weapon/jammingSword";
import { thiefLeggingsSkill } from "./armor/thiefLeggings";

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
skillManager.register(new cosmicMeteorSkill())
skillManager.register(new explosiveAxeSkill())
skillManager.register(new harubaguSpecialCatalogSKill())
skillManager.register(new deathNoteSkill())
skillManager.register(new highSpeedSkill())
skillManager.register(new magicTechGunSwordSkill())
skillManager.register(new slowHelmetSkill())
skillManager.register(new superSlowHelmetSkill())
skillManager.register(new regenerationChestPlateSkill())
skillManager.register(new superRegenerationChestPlateSkill())
skillManager.register(new pushFeatherSkill())
skillManager.register(new leapFeatherSkill())
skillManager.register(new blueBirdOfHappinessSkill())
skillManager.register(new jammingSwordSkill())
skillManager.register(new thiefLeggingsSkill())

skillManager.tickSkillRegister(new speedBootsSkill())
skillManager.tickSkillRegister(new slowHelmetSkill())
skillManager.tickSkillRegister(new superSlowHelmetSkill())
skillManager.tickSkillRegister(new regenerationChestPlateSkill())
skillManager.tickSkillRegister(new superRegenerationChestPlateSkill())
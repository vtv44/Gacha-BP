import { world, system, ItemCompostableComponent, ItemStack, GameMode, InputPermissionCategory, EquipmentSlot, Dimension, TicksPerDay, Entity, CommandPermissionLevel, EnchantmentType, EnchantmentTypes } from "@minecraft/server";
import { skillManager } from "./skill/skillManager";
import "./skill/skillRegister";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gachaBase } from "./gacha/gachaBase";
import { rareWeapons } from "./gacha/weaponGacha/weaponItem/rareWeapons";
import { weaponGacha } from "./gacha/weaponGacha/weaponGacha";
import { game } from "./game/game";
import { skillBase } from "./skill/skillBase";
import { theEnd } from "./game/maps/theEnd";
import { rankPointManager } from "./game/rankPointManager";
import { skyIsland } from "./game/maps/skyIsland";
import { defenceGacha } from "./gacha/defenceGacha/defenceGacha";
import { spellGacha } from "./gacha/spellGacha/spellGacha";
import { commandFunctions } from "./commands";
import { forms } from "./game/forms";
import { unCommonArmors } from "./gacha/defenceGacha/defenceItem/unCommonArmors";
import { divineArmors } from "./gacha/defenceGacha/defenceItem/divineArmors";
import { epicWeapons } from "./gacha/weaponGacha/weaponItem/epicWeapons";

const slots = [
    EquipmentSlot.Head,
    EquipmentSlot.Chest,
    EquipmentSlot.Legs,
    EquipmentSlot.Feet,
    EquipmentSlot.Mainhand,
]

const slots2 = [
    EquipmentSlot.Head,
    EquipmentSlot.Chest,
    EquipmentSlot.Legs,
    EquipmentSlot.Feet,
]

system.beforeEvents.startup.subscribe(ev => {
    const coinCommand = {
        name: "gacha:coin",
        description: "ガチャ用のコインを配ります",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [],
        optionalParameters: []
    }

    const gameCommand = {
        name: "gacha:game",
        description: "ゲームに関連するいろいろ",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [],
        optionalParameters: []
    }

    const repairCommand = {
        name: "gacha:maprepair",
        description: "マップを修復します",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [],
        optionalParameters: []
    }

    const shopCommand = {
        name: "gacha:shop",
        description: "ショップを開きます",
        permissionLevel: CommandPermissionLevel.Any
    }
    
    ev.customCommandRegistry.registerCommand(coinCommand, commandFunctions.coin);
    ev.customCommandRegistry.registerCommand(gameCommand, commandFunctions.game);
    ev.customCommandRegistry.registerCommand(repairCommand, commandFunctions.mapRepair);
    ev.customCommandRegistry.registerCommand(shopCommand, commandFunctions.shop);
})

system.runInterval(() => {
    // if (!world.getDynamicProperty("game")) return;

    const players = world.getAllPlayers()
    for (const p of players) {
        const item = p.getComponent("inventory").container.getSlot(p.selectedSlotIndex).getItem();
        if (!item) continue;
        const skill = skillManager.tickSkillGet(item.nameTag);
        if (!skill) continue;
        skill.has(p);
    }
})

system.runInterval(() => {
    // if (!world.getDynamicProperty("game")) return;

    const players = world.getAllPlayers()
    for (const p of players) {
        const armor = p.getComponent("equippable");
        for (const slot of slots2) {
            const item = armor.getEquipment(slot);
            const skill = skillManager.tickSkillGet(item?.nameTag);
            if (!skill) continue;
            skill.equip(p);
        }
    }
}, 5)

system.runInterval(() => {
    game.onSecond()
}, 20)


world.beforeEvents.chatSend.subscribe(ev => {
    const {message, sender} = ev;
    ev.cancel = true;
    if (world.getDynamicProperty("game")) {
        world.sendMessage(`<${sender.name}> ${message}`)
    } else {
        world.sendMessage(`<${sender.nameTag}> ${message}`)
    }
})

world.beforeEvents.entityHurt.subscribe(ev => {
    const {damage, damageSource, hurtEntity} = ev;

    if (hurtEntity.typeId !== "minecraft:player") return;
    // if (!world.getDynamicProperty("game")) ev.cancel = true;
    
    const armor = hurtEntity.getComponent("equippable");
    for (const slot of slots) {
       const item = armor.getEquipment(slot)
       const skill = skillManager.get(item?.nameTag);
       if (!skill) continue;
       skill.onHurtBefore(hurtEntity, ev);
    }
})

world.beforeEvents.playerLeave.subscribe(ev => {
    if (world.getDynamicProperty("game")) game.playerLeave(ev.player);
})

world.afterEvents.worldLoad.subscribe(ev => {
    const dimension = world.getDimension("overworld");
    const tickManager = world.tickingAreaManager;
    
    // game.gameReset();

    const wPos = weaponGacha.buttonPos
    const dPos = defenceGacha.buttonPos
    const sPos = spellGacha.buttonPos

    tickManager.createTickingArea("weaponGacha", {dimension: dimension, from: wPos, to: wPos});

    tickManager.createTickingArea("defenceGacha", {dimension: dimension, from: dPos, to: dPos});

    tickManager.createTickingArea("spellGacha", {dimension: dimension, from: sPos, to: sPos});

    system.runTimeout(() => {
        weaponGacha.buttonPlace();
        defenceGacha.buttonPlace();
        spellGacha.buttonPlace();
    }, 40)

    const score = world.scoreboard;
    if (!score.getObjective("team")) {
        score.addObjective("team", "team");
    }
    if (!score.getObjective("coin")) {
        score.addObjective("coin", "coin");
    }
    if (!score.getObjective("gameInfo")) {
        score.addObjective("gameInfo", "§lGacha PvP");
    }
})

world.afterEvents.buttonPush.subscribe(ev => {
    const {block, dimension, source} = ev;
    const pos = block.location;

    if (!source.typeId === "minecraft:player") return;

    if (locationCompare(pos, weaponGacha.buttonPos)) {
        weaponGacha.rollGacha(source);
    }

    if (locationCompare(pos, defenceGacha.buttonPos)) {
        defenceGacha.rollGacha(source);
    }

    if (locationCompare(pos, spellGacha.buttonPos)) {
        spellGacha.rollGacha(source);
    }
})

world.afterEvents.playerDimensionChange.subscribe(ev => {
    const {player} = ev;
    if (world.getDynamicProperty("game")) {
        system.runTimeout(() => {
            player.kill()
        }, 100)
    }
})

world.beforeEvents.effectAdd.subscribe(ev => {
    const {entity} = ev;
    const tick = system.currentTick;
    if (!entity.isValid) return;

    if (tick < entity.getDynamicProperty("effectCancelTime")) ev.cancel = true;
})

world.afterEvents.itemUse.subscribe(async ev => {
    const {source, itemStack} = ev;
    const id = itemStack.typeId;
    
    if (id === "minecraft:diamond") {
        // tester
        world.sendMessage(`${world.getDynamicProperty("game")}`)
    }

    if (id === "minecraft:iron_ingot") {
        
    }

    if (id === "minecraft:nether_star" && !source.hasTag("gachaing")) {
        const form = new ActionFormData()
        .title("select")
        .button("§l§cWEAPON")
        .button("§l§bDEFENCE")
        .button("§l§aMAGIC")
        .button("§l§dHUB");

        form.show(source).then((res) => {
            if (res.canceled || world.getDynamicProperty("game") || source.hasTag("gachaing")) return;

            switch(res.selection) {
                case 0: 
                    source.runCommand(`tp @s -300 0 0 90`);
                    break;
                case 1: 
                    source.runCommand(`tp @s 300 0 0 90`);
                    break;
                case 2: 
                    source.runCommand(`tp @s 0 0 300 90`);
                    break;
                case 3: 
                    source.runCommand(`tp @s 0 1 0 90`);
                    break;
            }

            system.runTimeout(() => {
                source.runCommand("playsound beacon.power @s");
                source.runCommand("playsound mob.endermen.portal @s");
            }, 1);
        }) 
    }

    // if (!world.getDynamicProperty("game")) return;

    const skill = skillManager.get(itemStack.nameTag);
    if (skill) skill.use(source, ev);

    const tickSkill = skillManager.tickSkillGet(itemStack.nameTag);
    if (tickSkill) tickSkill.use(source, ev);
})

world.afterEvents.entityDie.subscribe(ev => {
    if (world.getDynamicProperty("game")) game.playerDie(ev);
})

world.afterEvents.entityHitEntity.subscribe((event) => {
    const { damagingEntity, hitEntity } = event;

    if (damagingEntity.typeId !== "minecraft:player") return;

    const destinations = {
        "gacha:spin_sword": "-300 0 0",
        "gacha:spin_armor": "300 0 0",
        "gacha:spin_book": "0 0 300",
        "gacha:spin_netherstar": "0 1 0"
    };

    const dest = destinations[hitEntity.typeId];
    if (!dest) return;

    damagingEntity.runCommand(`tp @s ${dest} 90 0`);

    system.runTimeout(() => {
        damagingEntity.runCommand("playsound beacon.power @s");
        damagingEntity.runCommand("playsound mob.endermen.portal @s");
    }, 1);
});

world.afterEvents.entityHurt.subscribe(ev => {
    const {damage, damageSource, hurtEntity} = ev;
    const damagingEntity = damageSource.damagingEntity;
    if (hurtEntity.typeId !== "minecraft:player") return;

    // if (!world.getDynamicProperty("game")) return;

    const armor = hurtEntity.getComponent("equippable");
    for (const slot of slots) {
       const item = armor.getEquipment(slot)
       const skill = skillManager.get(item?.nameTag);
       if (!skill) continue;
       skill.onHurt(hurtEntity, ev);
    }

    if (damagingEntity !== undefined && damagingEntity.typeId === "minecraft:player") {
        const armor = damagingEntity.getComponent("equippable");
        for (const slot of slots) {
            const item = armor.getEquipment(slot)
            const skill = skillManager.get(item?.nameTag);
            if (!skill) continue;
            skill.onDamage(damagingEntity, ev);
        }
    }
})

world.afterEvents.entitySpawn.subscribe(ev => {
    const entity = ev.entity;
    if (
        entity.typeId === "minecraft:snow_golem" ||
        entity.typeId === "minecraft:iron_golem"
    ) entity.remove()
})

const blockedBlocks = [
    "minecraft:crying_obsidian",
    "minecraft:glowstone",
    "minecraft:dandelion",
    "minecraft:campfire",
    "minecraft:tnt"
    // "minecraft:xxxx",
];

const cancelBlocks = [
    // "minecraft:anvil",
    "minecraft:furnace",
    "minecraft:chipped_anvil",
    "minecraft:damaged_anvil",
    "minecraft:brewing_stand",
    "minecraft:respawn_anchor",
    "minecraft:smoker",
    "minecraft:blast_furnace",
    "minecraft:smithing_table",
    "minecraft:cartography_table",
    "minecraft:enchanting_table",
    "minecraft:composter",
    "minecraft:cauldron",
    "minecraft:jukebox",
    "minecraft:frame",
    "minecraft:stonecutter_block",
    "minecraft:loom",
    "minecraft:dropper",
    "minecraft:dispenser",
    "minecraft:hopper",
    "minecraft:crafter",
    "minecraft:chiseled_bookshelf",
    "minecraft:barrel",
    "minecraft:flower_pot",
    "minecraft:decorated_pot",
    "minecraft:bed",
    "minecraft:beacon",
    // クラフト用アイテム実装までキャンセル
    "minecraft:crafting_table",
]

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const { player, block } = event;
    const held = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
    if (blockedBlocks.includes(held?.typeId)) {
        event.cancel = true;
    }

    const id = block.typeId

    if (
        cancelBlocks.includes(id) ||
        id.includes("chest") ||
        id.includes("sign") ||
        id.includes("shelf") ||
        id.includes("shulker")
    ) event.cancel = true;

    if (world.getDynamicProperty("game")) {
        game.blockPlace(event);
    }
});

world.afterEvents.playerSpawn.subscribe(ev => {
    const {player, initialSpawn} = ev;
    if (initialSpawn) {
        game.resetPlayer(player);

        if (!player.getDynamicProperty("win")) player.setDynamicProperty("win", 0);
        if (!player.getDynamicProperty("kill")) player.setDynamicProperty("kill", 0);
        if (!player.getDynamicProperty("rp")) player.setDynamicProperty("rp", 0);

        rankPointManager.rankConfirm(player);

        if (world.getDynamicProperty("game")) {
            player.sendMessage(`§l§bガチャPVPへようこそ\n \n§l§f現在はバトルフェーズです`);

        } else {
            player.sendMessage(`§l§bガチャPVPへようこそ\n \n§l§f現在はガチャフェーズです`);
            world.scoreboard.getObjective("coin").setScore(player, 0)
        }
    }
})

function locationCompare(pos1, pos2) {
    return (
        pos1.x === pos2.x &&
        pos1.y === pos2.y &&
        pos1.z === pos2.z
    )
}
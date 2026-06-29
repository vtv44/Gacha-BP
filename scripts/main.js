import { world, system, ItemCompostableComponent, ItemStack, GameMode, InputPermissionCategory, EquipmentSlot, Dimension, TicksPerDay, Entity } from "@minecraft/server";
import { skillManager } from "./skill/skillManager";
import "./skill/skillRegister";
import { ActionFormData } from "@minecraft/server-ui";
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

system.runInterval(() => {
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

world.afterEvents.worldLoad.subscribe(ev => {
    world.setDynamicProperty("game", false);

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
        const dimension = world.getDimension("overworld")
        world.sendMessage(`${dimension.getBlock({x: 320, y: 0, z: 2000}).typeId}`)
    }

    if (id === "minecraft:stick") {
        new spellGacha().leaveGacha(source)
    }

    if (id === "minecraft:emerald") {

    }

    if (id === "minecraft:iron_ingot") {
        const string = new gachaBase().lottery();
        world.sendMessage(`${string}`);
    }

    if (id === "minecraft:nether_star") {
        const form = new ActionFormData()
        .title("select")
        .button("§l§cWEAPON")
        .button("§l§bDEFENCE")
        .button("§l§aMAGIC")
        .button("§l§dHUB");
        form.show(source).then((res) => {
            if (res.canceled) return;
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
        }) 
    }

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

    if (!entity.typeId === "minecraft:player") return;

    if (
        entity.typeId === "minecraft:snow_golem" ||
        entity.typeId === "minecraft:iron_golem"
    ) entity.remove()
})

const blockedBlocks = [
    "minecraft:crying_obsidian",
    "minecraft:glowstone",
    "minecraft:dandelion"
    // "minecraft:xxxx",
];

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const { player } = event;
    const held = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
    if (blockedBlocks.includes(held?.typeId)) {
        event.cancel = true;
    }
});

world.afterEvents.playerSpawn.subscribe(ev => {
    const {player, initialSpawn} = ev;
    if (initialSpawn) {
        game.resetPlayer(player)

        if (!player.getDynamicProperty("win")) player.setDynamicProperty("win", 0);
        if (!player.getDynamicProperty("kill")) player.setDynamicProperty("kill", 0);
        if (!player.getDynamicProperty("rp")) player.setDynamicProperty("rp", 0);

        rankPointManager.rankConfirm(player)

        if (world.getDynamicProperty("game")) {
            player.sendMessage(`§l§bガチャPVPへようこそ\n \n§l§f現在はバトルフェーズです`);

        } else {
            player.sendMessage(`§l§bガチャPVPへようこそ\n \n§l§f現在はガチャフェーズです`);
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
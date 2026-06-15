import { world, system, ItemCompostableComponent, ItemStack, GameMode, InputPermissionCategory, EquipmentSlot, Dimension } from "@minecraft/server";
import { skillManager } from "./skill/skillManager";
import "./skill/skillRegister";
import { ActionFormData } from "@minecraft/server-ui";
import { gachaBase } from "./gacha/gachaBase";
import { rareWeapons } from "./gacha/weaponGacha/weaponItem/rareWeapons";
import { weaponGacha } from "./gacha/weaponGacha/weaponGacha";
import { game } from "./game/game";
import { skillBase } from "./skill/skillBase";
import { theEnd } from "./game/maps/theEnd";

const slots = [
    EquipmentSlot.Head,
    EquipmentSlot.Chest,
    EquipmentSlot.Legs,
    EquipmentSlot.Feet,
    EquipmentSlot.Mainhand,
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
        for (const slot of slots) {
            const item = armor.getEquipment(slot);
            const skill = skillManager.tickSkillGet(item?.nameTag);
            if (!skill) continue;
            skill.equip(p);
        }
    }
}, 5)

system.runInterval(() => {
    new game().onSecond();
}, 20)

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
    // atkGacha -322 3 0
    // defGacha 278 3 0
    // spellGacha -22 3 300
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
        const positions = await new theEnd().mapSpawnPos(10)
        for (const p of positions) {
            world.sendMessage(`${p.x}, ${p.y}, ${p.z}`)
        }
    }

    if (id === "minecraft:emerald") {
        new theEnd().buildRepair()
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
    if (!skill) return;
    skill.use(source, ev);
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

const blockedBlocks = [
    "minecraft:crying_obsidian",
    "minecraft:glowstone",
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
        player.setDynamicProperty("effectCancelTime", 0)

        if (world.getDynamicProperty("game")) {

        } else {

        }
    }
})
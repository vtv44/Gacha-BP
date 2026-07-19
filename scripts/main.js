import { world, system, ItemCompostableComponent, ItemStack, GameMode, InputPermissionCategory, EquipmentSlot, Dimension, TicksPerDay, Entity, CommandPermissionLevel, EnchantmentType, EnchantmentTypes, ItemLockMode } from "@minecraft/server";
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
import { epicSpells } from "./gacha/spellGacha/spellItem/epicSpells";
import { school } from "./game/maps/school";
import { discardMount } from "./game/maps/discardMount";


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
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [],
        optionalParameters: []
    }

    const gachaCommand = {
        name: "gacha:gacha",
        description: "ガチャを引けます",
        permissionLevel: CommandPermissionLevel.Any
    }

    const gameCommand = {
        name: "gacha:game",
        description: "ゲームに関連するいろいろ",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [],
        optionalParameters: []
    }

    const rankPointCommand = {
        name: "gacha:rankpoint",
        description: "ランクポイントを管理します",
        permissionLevel: CommandPermissionLevel.GameDirectors,
    }

    const repairCommand = {
        name: "gacha:maprepair",
        description: "マップを修復します",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [],
        optionalParameters: []
    }

    const shopCommand = {
        name: "gacha:shop",
        description: "ショップを開きます",
        permissionLevel: CommandPermissionLevel.Any
    }
    
    ev.customCommandRegistry.registerCommand(coinCommand, commandFunctions.coin);
    ev.customCommandRegistry.registerCommand(gachaCommand, commandFunctions.gacha);
    ev.customCommandRegistry.registerCommand(gameCommand, commandFunctions.game);
    ev.customCommandRegistry.registerCommand(rankPointCommand, commandFunctions.rankPoint);
    ev.customCommandRegistry.registerCommand(repairCommand, commandFunctions.mapRepair);
    ev.customCommandRegistry.registerCommand(shopCommand, commandFunctions.shop);
})

system.runInterval(() => {
    if (!world.getDynamicProperty("game")) return;

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
    if (!world.getDynamicProperty("game")) return;

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
    if (!world.getDynamicProperty("game")) ev.cancel = true;
    
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
    
    game.gameReset();

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

    if (!world.getDynamicProperty("game")) return;

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

    if (!world.getDynamicProperty("game")) return;

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
    "minecraft:tnt",
    "minecraft:wooden_hoe"
    // "minecraft:xxxx",
];

const cancelBlocks = [
    "minecraft:anvil",
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
    "minecraft:crafting_table",
]

function synthesizeWeapon(player, resultId, baseWeaponId, materialId, materialAmount, newName, newLore) {
    const inventory = player.getComponent("minecraft:inventory").container;
    
    let hasBaseWeapon = false;
    let materialTotal = 0;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item) {
            if (item.nameTag === baseWeaponId && !hasBaseWeapon) {
                hasBaseWeapon = true;
            }
            if (item.nameTag === materialId) {
                materialTotal += item.amount;
            }
        }
    }

    if (!hasBaseWeapon) {
        player.sendMessage(`§cベースとなるアイテムが足りません！`);
        player.playSound("note.bass");
        return;
    }
    if (materialTotal < materialAmount) {
        player.sendMessage(`§c合成素材が足りません！`);
        player.playSound("note.bass");
        return;
    }

    let weaponConsumed = false;
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item && item.nameTag === baseWeaponId && !weaponConsumed) {
            if (item.amount > 1) {
                item.amount -= 1;
                inventory.setItem(i, item);
            } else {
                inventory.setItem(i, undefined);
            }
            weaponConsumed = true;
            break;
        }
    }

    let remainingToConsume = materialAmount;
    for (let i = 0; i < inventory.size; i++) {
        if (remainingToConsume <= 0) break;
        const item = inventory.getItem(i);
        if (item && item.nameTag === materialId) {
            if (item.amount > remainingToConsume) {
                item.amount -= remainingToConsume;
                inventory.setItem(i, item);
                remainingToConsume = 0;
            } else {
                remainingToConsume -= item.amount;
                inventory.setItem(i, undefined);
            }
        }
    }

    const newItem = new ItemStack(resultId, 1);
    newItem.nameTag = newName;
    newItem.setLore(newLore);
    newItem.lockMode = ItemLockMode.inventory;

    inventory.addItem(newItem);
    
    player.sendMessage(`§a${newName}§aを合成しました！`);
    player.playSound("random.anvil_use");
}

function craftHyperion(player) {
    const inventory = player.getComponent("minecraft:inventory").container;
    
    const targetNames = [
        "§b血塗れの剣",
        "§b=魔銃剣= ディエゴ・ラ・イーフォルト",
        "§bアサシンブレード =極="
    ];

    let totalCount = 0;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item && targetNames.includes(item.nameTag)) {
            totalCount += item.amount;
        }
    }

    if (totalCount < 2) {
        player.sendMessage(`§cDivineレアリティの武器が合計2つ必要です！`);
        player.playSound("note.bass");
        return;
    }
    let remainingToConsume = 2;
    for (let i = 0; i < inventory.size; i++) {
        if (remainingToConsume <= 0) break;
        const item = inventory.getItem(i);

        if (item && targetNames.includes(item.nameTag)) {
            if (item.amount > remainingToConsume) {
                item.amount -= remainingToConsume;
                inventory.setItem(i, item);
                remainingToConsume = 0;
            } else {
                remainingToConsume -= item.amount;
                inventory.setItem(i, undefined);
            }
        }
    }

    // 3. Hyperionを付与する
    const newItem = new ItemStack("gacha:hyperion", 1);
    newItem.nameTag = "§bHyperion";
    newItem.setLore([
        "§b[頂点] §5右クリック",
        "§5常時力150が付与される",
        "§5右クリックすると視線方向にテレポート",
        "§5さらにテレポートした先で爆発し200万ダメージを与える",
        "§5さらにhpが増える"
    ]);
    newItem.lockMode = ItemLockMode.inventory; 

    inventory.addItem(newItem);
    
    player.sendMessage(`§bHyperion§aを合成しました！`);
    player.playSound("ui.toast.challenge_complete");
}

function showWeaponSynthesisMenu(player) {
    const form = new ActionFormData();
    form.title("§lアイテム合成メニュー");
    form.body("合成するアイテムを選んでください。");

    form.button("§6フロストチェストプレート\n§8(§f壊れた防具 §8+ §5バカデカ氷§8)", "textures/items/ice_armor");
    form.button("§6エンハンスファーン\n§8(§5バカデカ氷 §8+ §a壊れた剣§8)", "textures/items/enhance_fern");
    form.button("§5燃え盛る剣\n§8(§f燃え残った剣 §8+ §f赤色の魔力§8)", "textures/items/blazing_sword");
    
    form.button("§6衝撃的な弱さの剣\n§8(§1衝撃的な剣 §8+ §a弱さの剣§8)", "textures/items/veryweakness_sword");
    form.button("§bHyperion\n§8(Divineレアリティの武器2つ)", "textures/items/hyperion");

    form.button("キャンセル");

    form.show(player).then(response => {
        if (response.canceled || response.selection === 5) return;
        
        switch (response.selection) {
            case 0:
                synthesizeWeapon(player, "gacha:ice_armor", "§f壊れた防具", "§5バカデカ氷", 1, "§6フロストチェストプレート", [
                    "§w[アイシクルタイム] §5スニーク",
                    "§5スニークすると周りに氷を召喚してダメージと鈍化を与える",
                    "§510秒のクールタイムがある"
                ]);
                break;
            case 1:
                synthesizeWeapon(player, "gacha:enhance_fern", "§a壊れた剣", "§5バカデカ氷", 1, "§6エンハンスファーン", [
                    "§w[フロストウェーブ / レインシャーベット] §5右クリック スニーク",
                    "§5通常の右クリックなら前方に氷の衝撃波を放つ",
                    "§5スニークの右クリックなら周囲の敵に氷を落とす"
                ]);
                break;
            case 2:
                synthesizeWeapon(player, "gacha:blazing_sword", "§f燃え残った剣", "§f赤色の魔力", 1, "§5燃え盛る剣", [
                    "§c[燃え盛る激情] §5右クリック 攻撃",
                    "§5視点の方向へ突進しながら敵を斬り、自分と相手に火をつける",
                    "§5自分が燃えているとき、通常攻撃に追加で防御無視の2ダメージが付与される"
                ]);
                break;
            case 3:
                synthesizeWeapon(player, "gacha:veryweakness_sword", "§1衝撃的な剣", "§a弱さの剣", 1, "§d衝撃的な弱さの剣", [
                    "§e[衝撃的な弱体化] §5攻撃 右クリック",
                    "§5攻撃した相手に弱体化IVを1秒間付与する",
                    "§5右クリックで衝撃吸収IIを30秒間付与する(CT30秒)"
                ]);
                break;
            case 4:
                craftHyperion(player);
                break;
        }
    });
}

// かなどこメニュー
function showAnvilMenu(player) {
    const form = new ActionFormData();
    form.title("§lかなどこメニュー");
    form.body("何をしますか？");
    form.button("アイテムを合成する");
    form.button("エンチャントする");

    form.show(player).then(response => {
        if (response.canceled) return;
        
        if (response.selection === 0) {
            // 合成メニューを開く
            showWeaponSynthesisMenu(player);
        } else if (response.selection === 1) {
            // エンチャントメニュー（準備中）
            player.sendMessage("§eエンチャント機能は現在準備中です。");
        }
    });
}

function craftArmor(player, resultId, costId, costAmount) {
    const inventory = player.getComponent("minecraft:inventory").container;
    
    let total = 0;
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item && item.typeId === costId) {
            total += item.amount;
        }
    }

    if (total < costAmount) {
        player.sendMessage(`§6スペシャルクッキー§rが足りません！`);
        player.playSound("note.bass");
        return;
    }

    let remainingToConsume = costAmount;
    for (let i = 0; i < inventory.size; i++) {
        if (remainingToConsume <= 0) break;
        const item = inventory.getItem(i);
        if (item && item.typeId === costId) {
            if (item.amount > remainingToConsume) {
                item.amount -= remainingToConsume;
                inventory.setItem(i, item);
                remainingToConsume = 0;
            } else {
                remainingToConsume -= item.amount;
                inventory.setItem(i, undefined);
            }
        }
    }

    const newItem = new ItemStack(resultId, 1);
    
    newItem.nameTag = "§6クッキーアーマー";
    newItem.setLore([
        "§6[あーまいアーマー] §5装備",
        "§5お腹が減りにくくなる"
    ]);

    inventory.addItem(newItem);

    player.sendMessage(`§a防具を作成しました！`);
    player.playSound("random.anvil_use");
}

function craftRainbowArmor(player, resultId, costId, costAmount) {
    const inventory = player.getComponent("minecraft:inventory").container;
    
    let total = 0;
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item && item.typeId === costId) {
            total += item.amount;
        }
    }

    if (total < costAmount) {
        player.sendMessage(`§bプリズム§rが足りません！`);
        player.playSound("note.bass");
        return;
    }

    let remainingToConsume = costAmount;
    for (let i = 0; i < inventory.size; i++) {
        if (remainingToConsume <= 0) break;
        const item = inventory.getItem(i);
        if (item && item.typeId === costId) {
            if (item.amount > remainingToConsume) {
                item.amount -= remainingToConsume;
                inventory.setItem(i, item);
                remainingToConsume = 0;
            } else {
                remainingToConsume -= item.amount;
                inventory.setItem(i, undefined);
            }
        }
    }

    const newItem = new ItemStack(resultId, 1);

    newItem.nameTag = "§eプリズムアーマー";
    newItem.setLore([
        "§e[虹の輝き] §5装備",
        "§5様々な力が宿る防具"
    ]);

    inventory.addItem(newItem);
    
    player.sendMessage(`§aプリズムアーマーを作成しました！`);
    player.playSound("random.levelup", { volume: 0.5 });
}


function showCustomCrafting(player) {
    const form = new ActionFormData();
    form.title("§lカスタム作業台");
    form.body("作成する防具を選んでください。");

    form.button("§6クッキーヘルメット\n§8(§6スペシャルクッキー§81個)", "textures/items/cookie");
    form.button("§6クッキーチェストプレート\n§8(§6スペシャルクッキー§82個)", "textures/items/cookie");
    form.button("§6クッキーレギンス\n§8(§6スペシャルクッキー§82個)", "textures/items/cookie");
    form.button("§6クッキーブーツ\n§8(§6スペシャルクッキー§81個)", "textures/items/cookie");

    form.button("§eプリズムヘルメット\n§8(§bプリズム§81個)", "textures/items/rainbow_helmet");
    form.button("§eプリズムチェストプレート\n§8(§bプリズム§82個)", "textures/items/rainbow_chestplate");
    form.button("§eプリズムレギンス\n§8(§bプリズム§82個)", "textures/items/rainbow_leggings");
    form.button("§eプリズムブーツ\n§8(§bプリズム§81個)", "textures/items/rainbow_boots");
    
    form.button("キャンセル");

    form.show(player).then(response => {
        if (response.canceled || response.selection === 8) return;
        
        const cookieCost = "gacha:special_cookie";
        const prismCost = "gacha:prism";

        switch (response.selection) {
            case 0: craftArmor(player, "gacha:cookie_helmet", cookieCost, 1); break;
            case 1: craftArmor(player, "gacha:cookie_chestplate", cookieCost, 2); break;
            case 2: craftArmor(player, "gacha:cookie_leggings", cookieCost, 2); break;
            case 3: craftArmor(player, "gacha:cookie_boots", cookieCost, 1); break;

            case 4: craftRainbowArmor(player, "gacha:rainbow_helmet", prismCost, 1); break;
            case 5: craftRainbowArmor(player, "gacha:rainbow_chestplate", prismCost, 2); break;
            case 6: craftRainbowArmor(player, "gacha:rainbow_leggings", prismCost, 2); break;
            case 7: craftRainbowArmor(player, "gacha:rainbow_boots", prismCost, 1); break;
        }
    });
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const { player, block } = event;
    const held = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
    
    if (blockedBlocks.includes(held?.typeId)) {
        event.cancel = true;
    }

    const id = block.typeId;
    const { x, y, z } = block.location;

    if (id === "minecraft:crafting_table" && x === 23 && y === 0 && z === -1) {
        system.run(() => {
            showCustomCrafting(player);
        });
    }
    if (id.includes("anvil") && x === -15 && y === 1 && z === 10) {
        event.cancel = true; 
        system.run(() => {
            showAnvilMenu(player);
        });
    }

    if (
        cancelBlocks.includes(id) ||
        id.includes("chest") ||
        id.includes("sign") ||
        id.includes("shelf") ||
        id.includes("shulker")
    ) {
        event.cancel = true;
    }

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

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const { player } = ev;
    
    if (!world.getDynamicProperty("game")) return;

    const item = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
    if (!item) return;

    const skill = skillManager.get(item.nameTag);
    
    if (skill && typeof skill.onBreakBlock === "function") {
        skill.onBreakBlock(player, ev);
    }
});
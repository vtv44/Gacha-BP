import { world, system, ItemCompostableComponent, ItemStack, GameMode, InputPermissionCategory } from "@minecraft/server";
import { skillManager } from "./skill/skillManager";
import "./skill/skillRegister";
import { ActionFormData } from "@minecraft/server-ui";
import { gachaBase } from "./gacha/gachaBase";
import { rareWeapons } from "./gacha/weaponGacha/weaponItem/rareWeapons";
import { weaponGacha } from "./gacha/weaponGacha/weaponGacha";

world.afterEvents.worldLoad.subscribe(ev => {
    world.setDynamicProperty("game", false);
    const score = world.scoreboard;
    if (!score.getObjective("team")) {
        score.addObjective("team", "team");
    }
    if (!score.getObjective("coin")) {
        score.addObjective("coin", "coin");
    }
})

world.afterEvents.buttonPush.subscribe(ev => {
    // atkGacha -322 3 0
    // defGacha 278 3 0
    // spellGacha -22 3 300
})

world.afterEvents.itemUse.subscribe(ev => {
    const {source, itemStack} = ev;
    const id = itemStack.typeId;

    if (id === "minecraft:diamond") {
        new weaponGacha().rollGacha(source);
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
    if (damagingEntity !== undefined) {
        const container = damagingEntity.getComponent("inventory").container;
        const item = container.getSlot(damagingEntity.selectedSlotIndex).getItem();
        if(!item) return;

        const skill = skillManager.get(item.nameTag);
        if (!skill) return;
        skill.onDamage(damagingEntity, ev);
    }
})
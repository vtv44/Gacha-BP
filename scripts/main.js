import { world, system, ItemCompostableComponent } from "@minecraft/server";
import { skillManager } from "./skill/skillManager";
import "./skill/skillRegister";
import { ActionFormData } from "@minecraft/server-ui";

world.afterEvents.worldLoad.subscribe(ev => {
    world.setDynamicProperty("game", false);
})

world.afterEvents.itemUse.subscribe(ev => {
    const {source, itemStack} = ev;
    const id = itemStack.typeId;

    if (id === "minecraft:nether_star") {
        const form = new ActionFormData()
        .title("select")
        .button("wpn")
        .button("def")
        .button("spl")
        .button("hub");
        form.show(source).then((res) => {
            if (res.canceled) return;
            switch(res.selection) {
                case 0: 
                    world.sendMessage(`wpn`);
                    break;
                case 1: 
                    world.sendMessage(`def`);
                    break;
                case 2: 
                    world.sendMessage(`spl`);
                    break;
                case 3: 
                    world.sendMessage(`hub`);
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
        "gacha:spin_book": "0 0 300"
    };

    const dest = destinations[hitEntity.typeId];
    if (!dest) return;

    damagingEntity.runCommand(`tp @s ${dest}`);
    damagingEntity.runCommand("playsound beacon.power @s");
    damagingEntity.runCommand("playsound mob.endermen.portal @s");
});
import { world, system } from "@minecraft/server";

world.afterEvents.itemUse.subscribe(ev => {
    const {source, itemStack} = ev;
    world.sendMessage(`ItemUsed`);
})
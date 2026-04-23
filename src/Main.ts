import { Vector2Builder, Vector3Builder } from '@minecraft/math';
import {
    EffectTypes,
    EntityEquippableComponent,
    EntityInventoryComponent,
    EquipmentSlot,
    GameMode,
    ItemStack,
    Player,
    system,
    world,
} from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';
import { Forms } from 'form/Forms';
import { Game } from 'game/Game';
import { PlayerData } from 'PlayerData';
import { Util } from 'Util';

export class Main {
    private static instance: Main;

    private constructor() {
        this.enable();
    }

    static getInstance(): Main {
        if (!this.instance) {
            this.instance = new Main();
        }
        return this.instance;
    }

    private enable() {
        system.runInterval(() => {
            Game.getInstance().getItemSession().passTick();
            // Game.getInstance().passTick();
        });

        world.afterEvents.itemUse.subscribe((ev) => {
            const { itemStack, source } = ev;
            Game.getInstance().getItemSession().onItemUse(source, itemStack);
            // Game.getInstance().onItemUse(source, itemStack);

            if (itemStack.nameTag === 'AU' && source.hasTag('op')) {
                PlayerData.get(source).showForm(Forms.TELEPORT);
            }
        });

        world.afterEvents.itemUseOn.subscribe((ev) => {
            const { itemStack, source } = ev;
            Game.getInstance().getItemSession().onItemUseOn(source, itemStack);
            // Game.getInstance().onItemUseOn(source, itemStack);
        });

        world.afterEvents.playerSpawn.subscribe((ev) => {
            const { initialSpawn, player } = ev;
            if (!initialSpawn) return;
            const inventory = player.getComponent('inventory');
            if (!(inventory instanceof EntityInventoryComponent)) return;
            inventory.container.clearAll();
            const equip = player.getComponent(EntityEquippableComponent.componentId);
            if (!(equip instanceof EntityEquippableComponent)) return;
            equip.setEquipment(EquipmentSlot.Head, new ItemStack(MinecraftItemTypes.Air));
            equip.setEquipment(EquipmentSlot.Chest, new ItemStack(MinecraftItemTypes.Air));
            equip.setEquipment(EquipmentSlot.Legs, new ItemStack(MinecraftItemTypes.Air));
            equip.setEquipment(EquipmentSlot.Feet, new ItemStack(MinecraftItemTypes.Air));
            equip.setEquipment(EquipmentSlot.Offhand, new ItemStack(MinecraftItemTypes.Air));
            player.teleport(Util.align(new Vector3Builder(0, 68, 0), true, false, true), { rotation: new Vector2Builder(0, 0) });
            EffectTypes.getAll().forEach((effect) => {
                player.removeEffect(effect);
            });
            player.setSpawnPoint();
            player.setGameMode(GameMode.adventure);
            // PlayerData.get(player).moveLocation(0);
        });

        world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
            const { block, player } = ev;
            switch (block.typeId) {
                case 'minecraft:bed':
                case 'minecraft:crafting_table':
                case 'minecraft:furnace':
                case 'minecraft:end_portal_frame':
                    ev.cancel = true;
                    break;
                case 'minecraft:anvil':
                case 'minecraft:chipped_anvil':
                case 'minecraft:damaged_anvil':
                    if (player.getGameMode() === GameMode.creative) break;
                    ev.cancel = true;
                    break;
            }
        });

        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            const { id, sourceEntity } = ev;
            if (!(sourceEntity instanceof Player)) return;
            const prefix = 'gc:';
            if (!id.startsWith(prefix)) return;
            switch (id.slice(prefix.length)) {
                case 'lore':
                    PlayerData.get(sourceEntity).showForm(Forms.LORE);
                    break;
                case 'au':
                    PlayerData.get(sourceEntity).showForm(Forms.TELEPORT);
                    break;
                case 'start':
                    PlayerData.get(sourceEntity).showForm(Forms.GAME_START);
                    break;
                case 'test':
                    let msg = '';
                    world.getAllPlayers().forEach((player) => {
                        msg += `${player.name}: ${player.clientSystemInfo.maxRenderDistance}, ${player.clientSystemInfo.memoryTier}, ${player.clientSystemInfo.platformType}`;
                    });
                    sourceEntity.sendMessage(msg);
                    break;
            }
        });
    }
}

Main.getInstance();

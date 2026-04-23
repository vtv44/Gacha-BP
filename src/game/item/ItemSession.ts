import { EntityEquippableComponent, EquipmentSlot, ItemStack, Player, world } from '@minecraft/server';
import { Item } from './Item';
import { Thor } from './items/Thor';
import { ItemNames } from './ItemNames';
import { PurpleMagic } from './items/PurpleMagic';
import { ShadowHelmet } from './items/ShadowHelmet';
import { Watchtower } from 'game/item/items/Watchtower';
import { CarpetBombing } from './items/CarpetBombing';
import { Game } from 'game/Game';

export class ItemSession {
    private session = new Map<Player, Item[]>();

    register(player: Player, item: ItemStack) {
        if (!this.session.has(player)) this.session.set(player, []);
        if (typeof item?.nameTag === 'undefined') return;
        if (this.session.get(player).some((e) => e.getName() === item?.nameTag)) return;
        switch (item?.nameTag) {
            case ItemNames.THOR:
                this.session.get(player).push(new Thor(player));
                break;
            case ItemNames.PURPLE_MAGIC:
                this.session.get(player).push(new PurpleMagic(player));
                break;
            case ItemNames.SHADOW_HELMET:
                this.session.get(player).push(new ShadowHelmet(player));
                break;
            case ItemNames.WATCHTOWER:
                this.session.get(player).push(new Watchtower(player));
                break;
            case ItemNames.CARPET_BOMBING:
                this.session.get(player).push(new CarpetBombing(player));
                break;
            default:
                return;
        }
    }

    onItemUse(player: Player, item: ItemStack) {
        if (!this.session.has(player)) return;
        this.session
            .get(player)
            .find((e) => e.getName() === item?.nameTag)
            ?.onUse();
    }

    onItemUseOn(player: Player, item: ItemStack) {
        if (!this.session.has(player)) return;
        this.session
            .get(player)
            .find((e) => e.getName() === item?.nameTag)
            ?.onUseOn();
    }

    passTick() {
        world.getAllPlayers().forEach((player) => {
            const equippable = player.getComponent(EntityEquippableComponent.componentId);
            if (!(equippable instanceof EntityEquippableComponent)) return;
            const itemSession = Game.getInstance().getItemSession();
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Mainhand));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Head));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Chest));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Legs));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Feet));
        });
        // let msg = '';
        this.session.forEach((item: Item[]) => {
            item.forEach((e) => {
                // msg += `${e.getName()}, `;
                e.passTick();
            });
        });
        // world
        //     .getAllsession()
        //     .find((p) => p.isSneaking)
        //     .sendMessage(msg);
    }
}

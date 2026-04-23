import { Vector3Utils } from '@minecraft/math';
import { EntityEquippableComponent, EquipmentSlot, Player, Vector3 } from '@minecraft/server';

export class Util {
    static mainhandItemName(player: Player, itemName: string): boolean {
        const equippable = player.getComponent(EntityEquippableComponent.componentId);
        if (!(equippable instanceof EntityEquippableComponent)) return;
        return equippable.getEquipment(EquipmentSlot.Mainhand)?.nameTag === itemName;
    }

    static headItemName(player: Player, itemName: string): boolean {
        const equippable = player.getComponent(EntityEquippableComponent.componentId);
        if (!(equippable instanceof EntityEquippableComponent)) return;
        return equippable.getEquipment(EquipmentSlot.Head)?.nameTag === itemName;
    }

    static chestItemName(player: Player, itemName: string): boolean {
        const equippable = player.getComponent(EntityEquippableComponent.componentId);
        if (!(equippable instanceof EntityEquippableComponent)) return;
        return equippable.getEquipment(EquipmentSlot.Chest)?.nameTag === itemName;
    }

    static legsItemName(player: Player, itemName: string): boolean {
        const equippable = player.getComponent(EntityEquippableComponent.componentId);
        if (!(equippable instanceof EntityEquippableComponent)) return;
        return equippable.getEquipment(EquipmentSlot.Legs)?.nameTag === itemName;
    }

    static feetItemName(player: Player, itemName: string): boolean {
        const equippable = player.getComponent(EntityEquippableComponent.componentId);
        if (!(equippable instanceof EntityEquippableComponent)) return;
        return equippable.getEquipment(EquipmentSlot.Feet)?.nameTag === itemName;
    }

    static align(v: Vector3, x: boolean, y: boolean, z: boolean): Vector3 {
        v = Vector3Utils.floor(v);
        if (x) v.x += 0.5;
        if (y) v.y += 0.5;
        if (z) v.z += 0.5;
        return v;
    }
}

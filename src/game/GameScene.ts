import { ItemStack, Player } from '@minecraft/server';

export interface GameScene {
    initialize(): void;
    onItemUse(player: Player, item: ItemStack): void;
    onItemUseOn(player: Player, item: ItemStack): void;
    passTick(): void;
}

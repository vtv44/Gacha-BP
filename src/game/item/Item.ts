import { Player } from '@minecraft/server';
import { ItemCoolTime } from './ItemCoolTime';
import { ItemQuantityLimit } from './ItemQuantityLimit';

export abstract class Item {
    private name: string;
    protected owner: Player;
    protected coolTime: ItemCoolTime;
    protected quantityLimit: ItemQuantityLimit;

    /**
     * @param coolTime 秒
     */
    constructor(name: string, owner: Player, coolTime = 0, quantityLimit = 0) {
        this.name = name;
        this.owner = owner;
        if (coolTime > 0) this.coolTime = new ItemCoolTime(coolTime);
        if (quantityLimit > 0) this.quantityLimit = new ItemQuantityLimit(quantityLimit);
    }

    getName() {
        return this.name;
    }

    onUse(): void {}
    onUseOn(): void {}
    passTick(): void {}
}

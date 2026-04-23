import { EntityDamageCause, Player } from '@minecraft/server';
import { Item } from '../Item';
import { Util } from 'Util';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';
import { ItemNames } from '../ItemNames';

export class Thor extends Item {
    constructor(owner: Player) {
        super(ItemNames.THOR, owner, 30);
    }

    onUse(): void {
        if (!this.coolTime.canStart()) return;
        this.owner.dimension
            .getPlayers({ location: this.owner.location, maxDistance: 15 })
            .filter((p) => this.owner.id !== p.id)
            .forEach((p) => {
                p.applyDamage(1, { cause: EntityDamageCause.selfDestruct, damagingEntity: this.owner });
                p.dimension.spawnEntity(MinecraftEntityTypes.LightningBolt, p.location);
            });
        this.coolTime.start();
    }

    passTick() {
        if (Util.mainhandItemName(this.owner, this.getName()))
            this.owner.onScreenDisplay.setActionBar(`${this.getName()}§fCT:${this.coolTime.getTime()}`);
        this.coolTime.decrease();
    }
}

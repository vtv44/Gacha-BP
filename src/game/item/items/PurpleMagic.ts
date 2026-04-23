import { EntityDamageCause, Player } from '@minecraft/server';
import { Item } from '../Item';
import { ItemNames } from '../ItemNames';
import { Util } from 'Util';

export class PurpleMagic extends Item {
    constructor(owner: Player) {
        super(ItemNames.PURPLE_MAGIC, owner);
    }

    onUse(): void {
        this.owner.runCommand('clone 216 41 3 218 44 5 ~-1~-1~-1 masked');
        this.owner.teleport(Util.align(this.owner.location, true, false, true));
        this.owner.playSound('random.enderchestopen');
        this.owner.applyDamage(3, { cause: EntityDamageCause.magic });
    }
}

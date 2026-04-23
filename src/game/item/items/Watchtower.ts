import { Player, system } from '@minecraft/server';
import { Item } from '../Item';
import { ItemNames } from '../ItemNames';
import { MinecraftEffectTypes } from '@minecraft/vanilla-data';

export class Watchtower extends Item {
    constructor(owner: Player) {
        super(ItemNames.WATCHTOWER, owner);
    }

    onUseOn(): void {
        this.owner.addEffect(MinecraftEffectTypes.Levitation, 20, { amplifier: 10, showParticles: false });
        system.runTimeout(() => {
            this.owner.dimension.playSound('mob.pillager.idle', this.owner.location);
            this.owner.runCommand('structure load kansitou ~-3~-9~-3');
        }, 25);
    }
}

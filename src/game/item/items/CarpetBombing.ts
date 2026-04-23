import { Player, system } from '@minecraft/server';
import { Item } from '../Item';
import { ItemNames } from '../ItemNames';
import { Util } from 'Util';
import { MinecraftEffectTypes } from '@minecraft/vanilla-data';

const TNT_AMOUNT: number = 32;

export class CarpetBombing extends Item {
    constructor(owner: Player) {
        super(ItemNames.CARPET_BOMBING, owner, 10, 3);
    }

    onUse(): void {
        if (!this.coolTime.canStart() || !this.quantityLimit.canConsume()) return;
        this.owner.dimension.playSound('horn.call.2', this.owner.location, { volume: 50 });
        this.owner.dimension
            .getPlayers({ location: this.owner.location, maxDistance: 45 })
            .filter((p) => this.owner.id !== p.id)
            .forEach((p) => {
                p.onScreenDisplay.setTitle('§c空襲警報');
            });
        system.run(async () => {
            for (let i = 0; i < 4; i++) {
                this.summonBomb();
                await system.waitTicks(20);
            }
        });
        system.runTimeout(() => {
            this.owner.addEffect(MinecraftEffectTypes.Levitation, 20, { amplifier: 30, showParticles: false });
            this.owner.addEffect(MinecraftEffectTypes.SlowFalling, 8 * 20, { amplifier: 0, showParticles: false });
        }, 60);
        this.coolTime.start();
        this.quantityLimit.consume();
    }

    passTick() {
        if (Util.mainhandItemName(this.owner, this.getName())) {
            if (this.coolTime.canStart()) {
                this.owner.onScreenDisplay.setActionBar(`${this.getName()}§f回数制限:${this.quantityLimit.getQuantity()}`);
            } else {
                this.owner.onScreenDisplay.setActionBar(`${this.getName()}§fCT:${this.coolTime.getTime()}`);
            }
        }
        this.coolTime.decrease();
    }

    private summonBomb() {
        for (let i = 0; i < TNT_AMOUNT; i++) {
            this.owner.dimension.spawnEntity('tnt', this.owner.location);
        }
        this.owner.runCommand(`spreadplayers ~~ 7 30 @e[type=tnt, c=${TNT_AMOUNT}]`);
        this.owner.runCommand(`execute as @e[type=tnt, c=${TNT_AMOUNT}] at @s run tp ~~65~`);
    }
}

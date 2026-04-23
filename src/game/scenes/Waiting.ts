import { Vector2Builder, Vector3Builder } from '@minecraft/math';
import { ItemStack, MinecraftDimensionTypes, Player, system, world } from '@minecraft/server';
import { Game } from 'game/Game';
import { GameScene } from 'game/GameScene';
import { PlayerData } from 'PlayerData';
import { Util } from 'Util';

const GATE_POS_START = new Vector3Builder(-1, 71, 24);
const GATE_POS_END = new Vector3Builder(2, 71.1, 27);

export class Waiting implements GameScene {
    private timeUntilStart: number;
    private isConfirmed: boolean;
    private isMapPosted: boolean;

    initialize(): void {
        this.timeUntilStart = 0;
        this.isConfirmed = false;
        this.isMapPosted = false;
    }

    onItemUse(player: Player, item: ItemStack): void {}

    onItemUseOn(player: Player, item: ItemStack): void {}

    passTick(): void {
        system.run(async () => {
            while (!this.isConfirmed) {
                this.gateToWaitingArea();
            }
            await system.waitTicks(2);
        });
        if (!this.isMapPosted) {
            this.postMap();
        }
    }

    private postMap() {
        const ms = Game.getInstance().getMapSelector();
        const dimension = world.getDimension(MinecraftDimensionTypes.overworld);
        switch (ms.getMaps().indexOf(ms.getBannedMap())) {
            case 0:
                if (dimension.runCommand('clone -79 53 -53 -65 70 -53 -79 78 -37 masked').successCount > 0) this.isMapPosted = true;
                break;
            case 1:
                if (dimension.runCommand('clone -79 53 -54 -65 70 -54 -79 78 -37 masked').successCount > 0) this.isMapPosted = true;
                break;
            case 2:
                if (dimension.runCommand('clone -79 53 -56 -65 70 -56 -79 78 -37 masked').successCount > 0) this.isMapPosted = true;
                break;
            case 3:
                if (dimension.runCommand('clone -79 53 -53 -65 70 -53 -79 78 -37 masked').successCount > 0) this.isMapPosted = true;
                break;
            case 4:
                if (dimension.runCommand('clone -79 53 -57 -65 70 -57 -79 78 -37 masked').successCount > 0) this.isMapPosted = true;
                break;
        }
    }

    private gateToWaitingArea() {
        const player = world
            .getAllPlayers()
            .find(
                (p) =>
                    GATE_POS_START.x <= p.location.x &&
                    GATE_POS_START.y <= p.location.y &&
                    GATE_POS_START.z <= p.location.z &&
                    GATE_POS_END.x > p.location.x &&
                    GATE_POS_END.y > p.location.y &&
                    GATE_POS_END.z > p.location.z
            );
        if (typeof player === 'undefined') return;
        if (!player.hasTag('noname')) {
            player.addTag('noname');
        }
        PlayerData.get(player).moveLocation(4);
        player.teleport(Util.align(new Vector3Builder(-72, 87, -49), true, false, true), { rotation: new Vector2Builder(0, 90) });
    }
}

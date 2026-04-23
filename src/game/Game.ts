import { GameScene } from 'game/GameScene';
import { Playing } from 'game/scenes/Playing';
import { Waiting } from './scenes/Waiting';
import { ItemSession } from 'game/item/ItemSession';
import { ItemStack, Player } from '@minecraft/server';
import { MapSelector } from './MapSelector';

const SCENES: GameScene[] = [new Waiting(), new Playing()];

export class Game {
    private static instance: Game;
    private isStarted = false;
    private scene: GameScene;
    private itemSession: ItemSession = new ItemSession();
    private mapSelector: MapSelector = new MapSelector();
    private teamGame: boolean = false;

    static getInstance(): Game {
        if (!this.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }

    start(teamGame: boolean, randomMap: boolean, bannedMap: number) {
        this.teamGame = teamGame;
        this.mapSelector.banMap(bannedMap);
        if (randomMap) this.mapSelector.selectMapByLottery();
        this.switchScene(0);
        this.isStarted = true;
    }

    finish() {
        this.isStarted = false;
    }

    switchScene(id: number) {
        this.scene = SCENES[id];
        this.scene.initialize();
    }

    passTick() {
        if (this.isStarted) this.scene.passTick();
    }

    onItemUse(player: Player, item: ItemStack) {
        if (this.isStarted) this.scene.onItemUse(player, item);
    }

    onItemUseOn(player: Player, item: ItemStack) {
        if (this.isStarted) this.scene.onItemUseOn(player, item);
    }

    getItemSession() {
        return this.itemSession;
    }

    getMapSelector() {
        return this.mapSelector;
    }
}

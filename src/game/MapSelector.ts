import { Vector2Builder, Vector3Builder } from '@minecraft/math';
import { GameMap } from './GameMap';
import { SafeArea } from './SafeArea';

export class MapSelector {
    private maps: GameMap[] = [
        new GameMap('魔女の集落', [new Vector3Builder(0, 100, 700)], [new SafeArea(new Vector2Builder(0, 700), 5)]),
        new GameMap('妖精の町', [new Vector3Builder(0, 100, 700)], [new SafeArea(new Vector2Builder(0, 700), 5)]),
        new GameMap('雪降る街', [new Vector3Builder(0, 100, 700)], [new SafeArea(new Vector2Builder(0, 700), 5)]),
        new GameMap('空島', [new Vector3Builder(0, 100, 700)], [new SafeArea(new Vector2Builder(0, 700), 5)]),
        new GameMap('崩壊都市', [new Vector3Builder(0, 100, 700)], [new SafeArea(new Vector2Builder(0, 700), 5)]),
    ];
    private availableMaps: GameMap[];
    private selectedMap: GameMap;
    private bannedMap: GameMap;
    private votes: number[];

    banMap(id: number) {
        this.bannedMap = this.maps[id];
        this.availableMaps = this.maps.filter((m) => m !== this.bannedMap);
    }

    selectMapByLottery() {
        this.selectedMap = this.availableMaps[Math.floor(Math.random() * this.availableMaps.length)];
    }

    voteMap(id: number) {
        this.votes[id]++;
    }

    selectMapByVote(votes: number[]) {
        if (votes.length !== this.availableMaps.length) throw Error('マップ投票の集計誤魔化すのやめてください');
        this.selectedMap = this.availableMaps[votes.indexOf(Math.max(...votes))];
    }

    getMap() {
        return this.selectedMap;
    }

    getBannedMap() {
        return this.bannedMap;
    }

    getMaps() {
        return this.maps;
    }

    getAvailableMaps() {
        return this.availableMaps;
    }
}

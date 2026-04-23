import { Vector3 } from '@minecraft/server';
import { SafeArea } from './SafeArea';

export class GameMap {
    private name: string;
    private spawnPoints: Vector3[];
    private safeAreas: SafeArea[];

    constructor(name: string, spawnPoints: Vector3[], safeAreas: SafeArea[]) {
        this.name = name;
        this.spawnPoints = spawnPoints;
        this.safeAreas = safeAreas;
    }

    getName() {
        return this.name;
    }

    getSpawnPoints(): Vector3[] {
        return this.spawnPoints;
    }

    getSafeAreas(): SafeArea[] {
        return this.safeAreas;
    }
}

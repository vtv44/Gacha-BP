import { Vector2, Vector3 } from '@minecraft/server';

export class SafeArea {
    center: Vector2;
    radius: number;

    constructor(center: Vector2, radius: number) {
        this.center = center;
        this.radius = radius;
    }

    isSafe(location: Vector3) {}
}

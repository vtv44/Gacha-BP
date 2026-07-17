import { world, system } from "@minecraft/server";
import { mapBase } from "./mapBase";

export class discardMount extends mapBase {
    constructor() {
        super()

        this.mapPos = [
            // mapPos[0]が最小値 mapPos[1]が最大値
            {x: 1, y: 5, z: -1999},
            {x: 176, y: 35, z: -1872}
        ]
        this.blockCancelHeight = {min: 0, max: 66}

        this.structures = [
            {id: "discard_mount_0", x: 0, y: 0, z: -2000},
            {id: "discard_mount_1", x: 0, y: 0, z: -1936},
            {id: "discard_mount_2", x: 64, y: 0, z: -2000},
            {id: "discard_mount_3", x: 64, y: 0, z: -1936},
            {id: "discard_mount_4", x: 128, y: 0, z: -2000},
            {id: "discard_mount_5", x: 128, y: 0, z: -1936},
        ]
    }

    async areaCenterPoint() {
        // 範囲中心地のやつ
        const randX = this.mapPos[1].x - this.mapPos[0].x
        const randZ = this.mapPos[1].z - this.mapPos[0].z

        const x = Math.floor(Math.random() * (randX - (randX / 10)) + (randX / 10)) 
        const y = 10
        const z = Math.floor(Math.random() * (randZ - (randZ / 10)) + (randZ / 10))
        return new Promise((resolve) => {
            resolve({x: x + this.mapPos[0].x, y: y, z: z + this.mapPos[0].z})
        })
    }

    async createTickingArea() {
        return new Promise((resolve) => {
            const dimension = world.getDimension("overworld")

            dimension.runCommand("tickingarea add 0 0 -2000 170 40 -1882 discard_mount_0")
            system.runTimeout(() => {
                resolve()
            }, 10)
        })
    }
}
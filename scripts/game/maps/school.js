import { world, system } from "@minecraft/server";
import { mapBase } from "./mapBase";

export class school extends mapBase {
    constructor() {
        super()

        this.mapPos = [
            // mapPos[0]が最小値 mapPos[1]が最大値
            {x: -2000, y: 0, z: 0},
            {x: -1808, y: 30, z: 128}
        ]
        this.blockCancelHeight = {min: 0, max: 46}

        this.structures = [
            {id: "school_0", x: -2000, y: 0, z: 0},
            {id: "school_1", x: -2000, y: 0, z: 64},
            {id: "school_2", x: -2000, y: 0, z: 128},
            {id: "school_3", x: -1936, y: 0, z: 0},
            {id: "school_4", x: -1936, y: 0, z: 64},
            {id: "school_5", x: -1936, y: 0, z: 128},
            {id: "school_6", x: -1872, y: 0, z: 0},
            {id: "school_7", x: -1872, y: 0, z: 64},
            {id: "school_8", x: -1872, y: 0, z: 128},
            {id: "school_9", x: -1808, y: 0, z: 0},
            {id: "school_10", x: -1808, y: 0, z: 64},
            {id: "school_11", x: -1808, y: 0, z: 128},
        ]
    }

    async createTickingArea() {
        return new Promise((resolve) => {
            const dimension = world.getDimension("overworld")

            dimension.runCommand("tickingarea add -2000 0 0 -1879 26 173 school_0")
            dimension.runCommand("tickingarea add -1879 0 0 -1758 26 173 school_1")
            system.runTimeout(() => {
                resolve()
            }, 10)
        })
    }
}
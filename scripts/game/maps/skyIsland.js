import { system, world } from "@minecraft/server";
import { mapBase } from "./mapBase";

export class skyIsland extends mapBase {
    constructor() {
        super()

        this.mapPos = [
            {x: 0, y: 40, z: 2000},
            {x: 320, y: 110, z: 2320}
        ]

        this.structures = [
            {id: "sky_island_0", x: 0, y: 0, z: 2000},
            {id: "sky_island_1", x: 64, y: 0, z: 2000},
            {id: "sky_island_2", x: 128, y: 0, z: 2000},
            {id: "sky_island_3", x: 192, y: 0, z: 2000},
            {id: "sky_island_4", x: 256, y: 0, z: 2000},
            {id: "sky_island_5", x: 320, y: 0, z: 2000},
            
            {id: "sky_island_6", x: 0, y: 0, z: 2064},
            {id: "sky_island_7", x: 64, y: 0, z: 2064},
            {id: "sky_island_8", x: 128, y: 0, z: 2064},
            {id: "sky_island_9", x: 192, y: 0, z: 2064},
            {id: "sky_island_10", x: 256, y: 0, z: 2064},
            {id: "sky_island_11", x: 320, y: 0, z: 2064},
            
            {id: "sky_island_12", x: 0, y: 0, z: 2128},
            {id: "sky_island_13", x: 64, y: 0, z: 2128},
            {id: "sky_island_14", x: 128, y: 0, z: 2128},
            {id: "sky_island_15", x: 192, y: 0, z: 2128},
            {id: "sky_island_16", x: 256, y: 0, z: 2128},
            {id: "sky_island_17", x: 320, y: 0, z: 2128},

            {id: "sky_island_18", x: 0, y: 0, z: 2192},
            {id: "sky_island_19", x: 64, y: 0, z: 2192},
            {id: "sky_island_20", x: 128, y: 0, z: 2192},
            {id: "sky_island_21", x: 192, y: 0, z: 2192},
            {id: "sky_island_22", x: 256, y: 0, z: 2192},
            {id: "sky_island_23", x: 320, y: 0, z: 2192},

            {id: "sky_island_24", x: 0, y: 0, z: 2256},
            {id: "sky_island_25", x: 64, y: 0, z: 2256},
            {id: "sky_island_26", x: 128, y: 0, z: 2256},
            {id: "sky_island_27", x: 192, y: 0, z: 2256},
            {id: "sky_island_28", x: 256, y: 0, z: 2256},
            {id: "sky_island_29", x: 320, y: 0, z: 2256},

            {id: "sky_island_30", x: 0, y: 0, z: 2320},
            {id: "sky_island_31", x: 64, y: 0, z: 2320},
            {id: "sky_island_32", x: 128, y: 0, z: 2320},
            {id: "sky_island_33", x: 192, y: 0, z: 2320},
            {id: "sky_island_34", x: 256, y: 0, z: 2320},
        ]
    }

    async createTickingArea() {
        return new Promise((resolve) => {
            const dimension = world.getDimension("overworld")

            dimension.runCommand("tickingarea add 0 0 2000 159 128 2159 sky_island_1")
            dimension.runCommand("tickingarea add 0 0 2160 159 128 2319 sky_island_2")
            dimension.runCommand("tickingarea add 160 0 2000 319 128 2159 sky_island_3")
            dimension.runCommand("tickingarea add 160 0 2160 319 128 2319 sky_island_4")

            dimension.runCommand("tickingarea add 320 0 2000 350 128 2319 sky_island_5")
            dimension.runCommand("tickingarea add 0 0 2320 319 128 2350 sky_island_6")

            system.runTimeout(() => {
                resolve()
            }, 10)
        })
    }
}
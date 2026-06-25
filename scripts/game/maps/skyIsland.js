import { mapBase } from "./mapBase";

export class skyIsland extends mapBase {
    constructor() {
        super()

        this.mapPos = [
            {x: 0, y: 0, z: 2000},
            {x: 320, y: 128, z: 2320}
        ]

        this.tickingPos = [
            {x: 0, y: 0, z: 2000, x2: 160, y2: 128, z2: 2160},
            {x: 161, y: 0, z: 2161, x2: 320, y2: 128, z2: 2320},
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
            {id: "sky_island_35", x: 320, y: 0, z: 2320},
        ]
    }
}
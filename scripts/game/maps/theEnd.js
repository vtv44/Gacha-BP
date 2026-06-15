import { mapBase } from "./mapBase";

export class theEnd extends mapBase {
    constructor() {
        super()

        this.mapPos = [
            {x: 2000, y: 27, z: 0},
            {x: 2127, y: 53, z: 127}
        ]

        this.structures = [
            {id: "the_end_0", x: 2000, y: 0, z: 0},
            {id: "the_end_1", x: 2064, y: 0, z: 0},
            {id: "the_end_2", x: 2000, y: 0, z: 64},
            {id: "the_end_3", x: 2064, y: 0, z: 64},
        ]
    }
}
import { world, system } from "@minecraft/server";
import { mapBase } from "./mapBase";

export class factory extends mapBase {
    constructor() {
        super()

        this.mapPos = [
            {x: 2000, y: 4, z: 2000},
            {x: 2125, y: 35, z: 2099}
        ]
        this.blockCancelHeight = {min: 0, max: 70}

        this.structures = [
            {id: "factory_0", x: 2000, y: 0, z: 2000},
            {id: "factory_1", x: 2000, y: 0, z: 2064},
            {id: "factory_2", x: 2064, y: 0, z: 2000},
            {id: "factory_3", x: 2064, y: 0, z: 2064},
        ]
    }

    async createTickingArea() {
        return new Promise((resolve) => {
            const dimension = world.getDimension("overworld")

            dimension.runCommand("tickingarea add 2000 0 2000 2125 35 2099 factory_0")
            system.runTimeout(() => {
                resolve()
            }, 10)
        })
    }
}
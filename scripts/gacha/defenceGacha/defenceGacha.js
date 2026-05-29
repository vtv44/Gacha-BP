import { gachaBase } from "../gachaBase";

export class defenceGacha extends gachaBase {
    constructor() {
        super()

        this.cost = 10
        this.buttonPos = {x: 278, y: 3, z: 0}
        this.gachaPos = {x: 271, y: 2, z: 0}
        this.returnPos = {x: 300, y: 0, z: 0}
    }
}
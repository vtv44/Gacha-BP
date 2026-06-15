import { system, world } from "@minecraft/server"

export class mapBase {
    constructor() {
        this.mapPos = [
            // mapPos[0]が最小値 mapPos[1]が最大値
            {x: -1, y: -1, z: -1},
            {x: 1, y: 1, z: 1}
        ]
        this.structures = [
            {id: "id", x: -1, y: -1, z: -1}
        ]
    }

    areaCenterPoint() {
        const x = Math.floor(Math.random() * (this.mapPos[1].x - this.mapPos[0].x)) 
        const y = this.mapPos[0].y
        const z = Math.floor(Math.random() * (this.mapPos[1].z - this.mapPos[0].z))
        return {x: x + this.mapPos[0].x, y: y, z: z + this.mapPos[0].z}
    }

    buildRepair() {
        const dimension = world.getDimension("overworld")
        for (let i = 0; i <= this.structures.length - 1; i++) {
            system.runTimeout(() => {
                world.structureManager.place(
                    this.structures[i].id,
                    dimension,
                    {
                        x: this.structures[i].x,
                        y: this.structures[i].y,
                        z: this.structures[i].z,
                    }
                )
            }, i * 5)
        }

        system.runTimeout(() => {
            world.tickingAreaManager.removeTickingArea("mapLoad")
        }, this.structures.length * 5)
    }

    createTickingArea() {
        const dimension = world.getDimension("overworld")
        world.tickingAreaManager.createTickingArea(
            "mapLoad",
            {
                dimension: dimension,
                from: this.mapPos[0],
                to: this.mapPos[1]
            }
        )
    }

    async mapSpawnPos(count) {
        // 渡された数だけランダムな座標を返す
        // 難しい仕様とかは一旦抜き
        // 壁に埋まるのだけ対策

        // 5tickまつ
        return new Promise((resolve) => {
            const positions = []
            const dimension = world.getDimension("overworld")

            this.createTickingArea()

            system.runTimeout(() => {
                for (let i = 0; i <= count; i++) {
                
                    const x = Math.floor(Math.random() * (this.mapPos[1].x - this.mapPos[0].x))
                    const y = Math.floor(Math.random() * (this.mapPos[1].y - this.mapPos[0].y))
                    const z = Math.floor(Math.random() * (this.mapPos[1].z - this.mapPos[0].z))

                    const spawnPos = {
                        x: x + this.mapPos[0].x, 
                        y: y + this.mapPos[0].y, 
                        z: z + this.mapPos[0].z
                    }

                    if (!this.spawnTest(dimension, spawnPos)) continue;
                    positions.push(spawnPos)
                }

                world.tickingAreaManager.removeTickingArea("mapLoad")
                
                resolve(positions)
            }, 5)
        })
    }

    spawnTest(dimension, pos) {
        const block = dimension.getBlock(pos)
        return (
            block.below().typeId !== "minecraft:air" ||
            block.typeId === "minecraft:air" ||
            block.above().typeId === "minecraft:air"
        ) 
    }
}
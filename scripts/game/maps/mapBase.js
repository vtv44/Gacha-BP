import { system, world } from "@minecraft/server"

export class mapBase {
    constructor() {
        this.mapPos = [
            // mapPos[0]が最小値 mapPos[1]が最大値
            {x: -1, y: -1, z: -1},
            {x: 1, y: 1, z: 1}
        ]
        this.tickingPos = [
            {x: 0, y: 0, z: 0, x2: 1, y2: 1, z2: 1},
        ]
        this.structures = [
            {id: "id", x: -1, y: -1, z: -1}
        ]
    }

    areaCenterPoint() {
        // 範囲中心地のやつ
        const x = Math.floor(Math.random() * (this.mapPos[1].x - this.mapPos[0].x)) 
        const y = this.mapPos[0].y
        const z = Math.floor(Math.random() * (this.mapPos[1].z - this.mapPos[0].z))
        return {x: x + this.mapPos[0].x, y: y, z: z + this.mapPos[0].z}
    }

    async buildRepair() {
        await this.createTickingArea()
        for (let i = 0; i <= this.structures.length - 1; i++) {
            const dimension = world.getDimension("overworld")
            const pos = {
                x: this.structures[i].x,
                y: this.structures[i].y,
                z: this.structures[i].z,
            }

            system.runTimeout(() => {
                world.structureManager.place(
                    this.structures[i].id,
                    dimension,
                    pos
                )
                dimension.setBlockType(pos, "minecraft:air")
            }, i * 5 + 5)
        }

        system.runTimeout(() => {
            for (let i = 0; i <= this.tickingPos.length - 1; i++) {
                world.tickingAreaManager.removeTickingArea(`mapLoad_${i}`)
            }
        }, this.structures.length * 5)
    }

    async createTickingArea() {
        return new Promise((resolve) => {
            for (let i = 0; i <= this.tickingPos.length - 1; i++) {
                const from = {
                    x: this.tickingPos[i].x,
                    y: this.tickingPos[i].y,
                    z: this.tickingPos[i].z,
                }

                const to = {
                    x: this.tickingPos[i].x2,
                    y: this.tickingPos[i].y2,
                    z: this.tickingPos[i].z2,
                }

                world.tickingAreaManager.createTickingArea(
                    `mapLoad_${i}`,
                    {
                        dimension: world.getDimension("overworld"),
                        from: from,
                        to: to
                    }
                )
            }
            resolve()
        })
    }

    async mapSpawnPos(count) {
        // 渡された数だけランダムな座標を返す
        // 難しい仕様とかは一旦抜き
        // 壁に埋まるのだけ対策
        return new Promise((resolve) => {
            const positions = []
            const dimension = world.getDimension("overworld")

            this.createTickingArea()

            system.runTimeout(() => {
                for (let i = 0; i <= count - 1; i++) {
                
                    const x = Math.floor(Math.random() * (this.mapPos[1].x - this.mapPos[0].x))
                    const y = Math.floor(Math.random() * (this.mapPos[1].y - this.mapPos[0].y))
                    const z = Math.floor(Math.random() * (this.mapPos[1].z - this.mapPos[0].z))

                    const spawnPos = {
                        x: x + this.mapPos[0].x, 
                        y: y + this.mapPos[0].y, 
                        z: z + this.mapPos[0].z
                    }

                    if (!this.spawnTest(dimension, spawnPos)) {
                        i--
                        continue
                    }
                    positions.push(spawnPos)
                }

                for (let i = 0; i <= this.tickingPos.length - 1; i++) {
                    world.tickingAreaManager.removeTickingArea(`mapLoad_${i}`)
                }
                
                resolve(positions)
            }, 20)
        })
    }

    spawnTest(dimension, pos) {
        const block = dimension.getBlock(pos)
        return (
            block.below().typeId !== "minecraft:air" &&
            block.typeId === "minecraft:air" &&
            block.above().typeId === "minecraft:air"
        ) 
    }
}
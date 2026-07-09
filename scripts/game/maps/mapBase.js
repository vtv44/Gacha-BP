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

    async areaCenterPoint() {
        // 範囲中心地のやつ
        const randX = this.mapPos[1].x - this.mapPos[0].x
        const randZ = this.mapPos[1].z - this.mapPos[0].z

        const x = Math.floor(Math.random() * (randX - (randX / 10)) + (randX / 10)) 
        const y = this.mapPos[1].y / 2
        const z = Math.floor(Math.random() * (randZ - (randZ / 10)) + (randZ / 10))
        return new Promise((resolve) => {
            resolve({x: x + this.mapPos[0].x, y: y, z: z + this.mapPos[0].z})
        })
    }

    buildRepair() {
        const dimension = world.getDimension("overworld")
        world.gameRules.doTileDrops = false

        for (let i = 0; i <= this.structures.length - 1; i++) {
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
            }, i * 10 + 5)
        }

        system.runTimeout(() => {
            world.sendMessage("マップの修復が完了しました")
            dimension.runCommand("tickingarea remove_all")
        }, this.structures.length * 10 + 20)
    }

    createTickingArea() {}

    async mapSpawnPos(count) {
        // 渡された数だけランダムな座標を返す
        // 難しい仕様とかは一旦抜き
        // 壁に埋まるのだけ対策
        await this.createTickingArea()
        return new Promise((resolve) => {
            const positions = []
            const dimension = world.getDimension("overworld")

            system.runTimeout(() => {
                for (let i = 0; i <= count - 1; i++) {
                
                    const x = Math.floor(Math.random() * (this.mapPos[1].x - this.mapPos[0].x))
                    const y = Math.floor(Math.random() * (this.mapPos[1].y - this.mapPos[0].y))
                    const z = Math.floor(Math.random() * (this.mapPos[1].z - this.mapPos[0].z))

                    const spawnPos = {
                        x: x + this.mapPos[0].x + 0.5, 
                        y: y + this.mapPos[0].y, 
                        z: z + this.mapPos[0].z + 0.5
                    }

                    try {
                        dimension.getBlock(spawnPos).below()
                    } catch {
                        i--
                        continue
                    }

                    if (!this.spawnTest(dimension, spawnPos)) {
                        i--
                        continue
                    }
                    positions.push(spawnPos)
                }

                dimension.runCommand("tickingarea remove_all")
                
                resolve(positions)
            }, 20)
        })
    }

    async spawnArea(areaPos) {
        const dimension = world.getDimension("overworld")

        await this.createTickingArea()

        dimension.spawnEntity("gacha:gacha_area", areaPos)
        system.run(() => {
            dimension.runCommand("tickingarea remove_all")
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
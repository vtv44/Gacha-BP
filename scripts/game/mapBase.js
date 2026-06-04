import { world } from "@minecraft/server"

export class mapBase {
    constructor() {
        this.mapPos = [
            // mapPos[0]が最小値 mapPos[1]が最大値
            {x: -1, y: -1, z: -1},
            {x: 1, y: 1, z: 1}
        ]
    }

    buildRepair() {
        // ストラクチャーのidと座標の保存方法を考える
    }

    mapSpawnPos(count) {
        // 渡された数だけランダムな座標を返す
        // 難しい仕様とかは一旦抜き
        // 壁に埋まるのだけ対策
        const positions = []
        const dimension = world.getDimension("overworld")
        
        for (let i = 0; i <= count; i++) {
            const x = Math.floor(Math.random() * this.mapPos[1].x - this.mapPos[0].x)
            const y = Math.floor(Math.random() * this.mapPos[1].y - this.mapPos[0].y)
            const z = Math.floor(Math.random() * this.mapPos[1].z - this.mapPos[0].z)

            const spawnPos = {
                x: x + this.mapPos[0].x, 
                y: y + this.mapPos[0].y, 
                z: z + this.mapPos[0].z
            }

            if (!this.spawnTest(dimension, spawnPos)) continue;
            positions.push(spawnPos)
        }

        return positions
    }

    spawnTest(dimension, pos) {
        const block = dimension.getBlock(pos)
        return (
            block.below(1).typeId === "minecraft:air" ||
            block.typeId === "minecraft:air" ||
            block.adove(1).typeId === "minecraft:air"
        ) 
    }
}
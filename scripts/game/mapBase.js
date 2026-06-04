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
        for (let i = 0; i <= count; i++) {

        }
    }

    spawnTest(pos) {
        
    }
}
export class ItemCoolTime {
    private time: number;
    private sourceTime: number;

    constructor(time: number, isTick = false) {
        if (time <= 0) throw Error('(0 < クールタイム)でお願いします');
        if (isTick) this.sourceTime = time;
        else this.sourceTime = time * 20;
        this.time = 0;
    }

    canStart(): boolean {
        return this.time === 0;
    }

    /**
     * 成功:true、失敗:false
     */
    decrease(): boolean {
        if (this.canStart()) {
            return false;
        }
        this.time -= 1;
        return true;
    }

    start(): void {
        if (this.canStart()) this.time = this.sourceTime;
    }

    getTime(isTick = false): number {
        if (isTick) return this.time;
        return Math.round(this.time / 20);
    }
}

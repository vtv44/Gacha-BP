export class ItemQuantityLimit {
    private quantity: number;

    constructor(quantity: number) {
        if (quantity <= 0) throw Error('(0 < 数量制限)でお願いします');
        this.quantity = quantity;
    }

    canConsume(): boolean {
        return this.quantity > 0;
    }

    /**
     * 成功:true、失敗:false
     */
    consume(): boolean {
        if (!this.canConsume()) {
            return false;
        }
        this.quantity -= 1;
        return true;
    }

    getQuantity(): number {
        return this.quantity;
    }
}

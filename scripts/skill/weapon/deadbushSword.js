import { skillBase } from "../skillBase";

export class deadbushSwordSkill extends skillBase {
    constructor() {
        super();
        this.id = "§1飢餓の剣"; // 他の武器スキルと同じ形式でIDを指定
    }

    onDamage(player, event) {
        event.hurtEntity.runCommand("effect @s hunger 10 1 true");
    }
}
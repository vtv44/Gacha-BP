import { world, system, ItemStack } from "@minecraft/server";
import { skillBase } from "../skillBase";

const itemConfigs = {
    breaker: {
        id: "gacha:breaker",
        name: "§dブレイカー",
        lore: [
            "§u[変形] §5右クリック 攻撃",
            "§5右クリックで§dクラッシャー§5に変形",
            "§5この武器による採掘はブロックを即座に破壊する"
        ]
    },
    crusher: {
        id: "gacha:crusher",
        name: "§dクラッシャー",
        lore: [
            "§9+4 攻撃力",
            "§u[変形] §5右クリック 攻撃",
            "§5右クリックで§dブレイカー§5に変形",
            "§5この武器の攻撃は相手の防御を貫通する",
        ]
    }
};


export class breakerSkill extends skillBase {
    constructor() {
        super();
        this.id = itemConfigs.breaker.name;
        this.cooldown = 1 * 20;

        system.runInterval(() => {
            for (const player of world.getPlayers()) {
                if (!this.canAddEffect(player)) continue;

                const inv = player.getComponent("inventory");
                const item = inv?.container?.getItem(player.selectedSlotIndex);
                
                if (item?.nameTag === this.id) {
                    player.addEffect("haste", 10, { amplifier: 99, showParticles: false });
                }
            }
        }, 5);
    }

    execute(player) {
        const inv = player.getComponent("inventory");
        const slotIndex = player.selectedSlotIndex;

        const newItem = new ItemStack(itemConfigs.crusher.id, 1);
        newItem.nameTag = itemConfigs.crusher.name;
        newItem.setLore?.(itemConfigs.crusher.lore);

        inv.container.setItem(slotIndex, newItem);

        player.dimension.playSound("random.anvil_use", player.location, { volume: 1.0, pitch: 1.5 });
        player.dimension.spawnParticle("minecraft:witchspell_emitter", player.location);

        this.onCooldown(player);
    }
}


export class crusherSkill extends skillBase {
    constructor() {
        super();
        this.id = itemConfigs.crusher.name;
        this.cooldown = 1 * 20;
    }

    execute(player) {
        const inv = player.getComponent("inventory");
        const slotIndex = player.selectedSlotIndex;

        const newItem = new ItemStack(itemConfigs.breaker.id, 1);
        newItem.nameTag = itemConfigs.breaker.name;
        newItem.setLore?.(itemConfigs.breaker.lore);

        inv.container.setItem(slotIndex, newItem);

        player.dimension.playSound("random.anvil_use", player.location, { volume: 1.0, pitch: 1.5 });
        player.dimension.spawnParticle("minecraft:witchspell_emitter", player.location);

        this.onCooldown(player);
    }

    onDamage(player, event) {
        const target = event.hurtEntity;
        const inv = player.getComponent("inventory");
        const item = inv?.container?.getItem(player.selectedSlotIndex);
        
        if (item?.nameTag === this.id) {
            system.run(() => {
                target?.applyDamage(5, { cause: "override" });
            });
        }
    }
}
import { system, EquipmentSlot, world } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class assassinSkill extends skillBase {
    static savedArmor = new Map();

    constructor() {
        super();
        this.id = "§5アサシン"; 
        this.cooldown = 20 * 60;

        world.afterEvents.entityHurt.subscribe((event) => {
            const { hurtEntity, damageSource } = event;
            const attacker = damageSource.damagingEntity;

            if (hurtEntity.typeId === "minecraft:player" && hurtEntity.hasTag("assassin_active")) {
                this.onHurt(hurtEntity, event);
            }

            if (attacker && attacker.typeId === "minecraft:player" && attacker.hasTag("assassin_active")) {
                this.onDamage(attacker, event);
            }
        });
    }

    execute(player) {
        if (player.hasTag("assassin_active")) return;

        player.dimension.playSound("random.fizz", player.location, { volume: 1.0, pitch: 1.0 });

        if (this.canAddEffect(player)) {
            player.addEffect("invisibility", 200, { showParticles: false });
        }
        
        player.addTag("assassin_active");
        player.sendMessage("§8姿を消し、防具を隠した...");

        const equippable = player.getComponent("equippable");
        if (equippable) {
            const head = equippable.getEquipment(EquipmentSlot.Head);
            const chest = equippable.getEquipment(EquipmentSlot.Chest);
            const legs = equippable.getEquipment(EquipmentSlot.Legs);
            const feet = equippable.getEquipment(EquipmentSlot.Feet);

            const offhand = equippable.getEquipment(EquipmentSlot.Offhand);

            assassinSkill.savedArmor.set(player.id, { head, chest, legs, feet, offhand });

            equippable.setEquipment(EquipmentSlot.Head, undefined);
            equippable.setEquipment(EquipmentSlot.Chest, undefined);
            equippable.setEquipment(EquipmentSlot.Legs, undefined);
            equippable.setEquipment(EquipmentSlot.Feet, undefined);
            equippable.setEquipment(EquipmentSlot.Offhand, undefined);
        }

        this.onCooldown(player);

        system.runTimeout(() => {
            this.endAssassinStatus(player);
        }, 200);
    }

    onDamage(player, event) {
        if (!player.hasTag("assassin_active")) return;
        const target = event.hurtEntity; 

        if (target) {
            // 攻撃したら即座に透明化を解除する
            this.endAssassinStatus(player);

            system.run(() => {
                player.dimension.playSound("entity.player.attack.crit", player.location, { volume: 1.0, pitch: 1.2 });
                
                // ▼ 変更点：無敵時間・防具を完全に貫通する固定ダメージ処理
                const health = target.getComponent("health");
                if (health) {
                    // 現在の体力から「3」を直接引き算する
                    const newHealth = health.currentValue - 3;

                    if (newHealth <= 0) {
                        // もしこの追加ダメージで相手が死ぬ場合は、キルログを正常に残すために特大ダメージを与えてトドメを刺す
                        target.applyDamage(999, {
                            cause: "magic",
                            damagingEntity: player
                        });
                    } else {
                        // 死なない場合は、体力の数値を直接書き換えて「確定ダメージ」を与える
                        health.setCurrentValue(newHealth);
                    }
                }
            });
        }
    }

    onHurt(player, event) {
        if (!player.hasTag("assassin_active")) return;

        this.endAssassinStatus(player);

        if (this.canAddEffect(player)) {
            player.addEffect("slowness", 200, { amplifier: 0 });
        }
        player.sendMessage("§c被弾により姿が露呈し、足がすくんだ！");
    }

    endAssassinStatus(player) {
        if (!player.hasTag("assassin_active")) return;

        player.dimension.playSound("mob.zombie.remedy", player.location, { volume: 1.0, pitch: 1.0 });

        player.removeTag("assassin_active");
        player.removeEffect("invisibility");
        player.sendMessage("§7アサシン状態が終了し、防具が戻った。");

        const armorData = assassinSkill.savedArmor.get(player.id);
        if (armorData) {
            const equippable = player.getComponent("equippable");
            if (equippable) {
                if (armorData.head) equippable.setEquipment(EquipmentSlot.Head, armorData.head);
                if (armorData.chest) equippable.setEquipment(EquipmentSlot.Chest, armorData.chest);
                if (armorData.legs) equippable.setEquipment(EquipmentSlot.Legs, armorData.legs);
                if (armorData.feet) equippable.setEquipment(EquipmentSlot.Feet, armorData.feet);
                if (armorData.offhand) equippable.setEquipment(EquipmentSlot.Offhand, armorData.offhand);
            }
            assassinSkill.savedArmor.delete(player.id);
        }
    }
}
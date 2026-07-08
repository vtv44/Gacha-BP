import { ItemStack, ItemLockMode } from "@minecraft/server";
import { skillBase } from "../skillBase";

export class craftPickaxeSkill extends skillBase {
    constructor() {
        super();
        this.id = "§aクラフトピッケル";
        this.cooldown = 0;
    }

    onBreakBlock(player, event) {
        const blockName = event.brokenBlockPermutation.type.id;
        const inventory = player.getComponent("inventory").container;
        const slot = player.selectedSlotIndex;

        if (blockName === "minecraft:dirt" || blockName === "minecraft:grass_block") {
            const dirtSword = new ItemStack("gacha:dirt_sword", 1);
            dirtSword.nameTag = "§n土の剣";
            dirtSword.setLore([
                "§f[埋没] §5攻撃時",
                "§5攻撃した相手を1マス下に埋める",
            ]);
            dirtSword.lockMode = ItemLockMode.inventory;
            
            inventory.setItem(slot, dirtSword);
            
            player.dimension.playSound("random.levelup", player.location, { volume: 0.5, pitch: 1.5 });
            player.sendMessage("§e[クラフト] §n土の剣§fを作成しました！");
        } 
        else if (blockName === "minecraft:stone" || blockName === "minecraft:cobblestone") {
            const stoneSword = new ItemStack("minecraft:stone_sword", 1);
            stoneSword.nameTag = "§7石の剣";
            stoneSword.setLore([
                "§f[石の加護] §5右クリック",
                "§5自身に耐性を付与し、周囲の敵を吹き飛ばしてダメージを与える",
            ]);
            stoneSword.lockMode = ItemLockMode.inventory;
            
            inventory.setItem(slot, stoneSword);
            
            player.dimension.playSound("random.levelup", player.location, { volume: 0.5, pitch: 1.5 });
            player.sendMessage("§e[クラフト] §7石の剣§fを作成しました！");
        }
        else if (blockName === "minecraft:end_stone") {
            const endstoneSword = new ItemStack("gacha:endstone_sword", 1);
            endstoneSword.nameTag = "§eエンドストーンソード";
            endstoneSword.setLore([
                "§f[テレポート] §5右クリック",
                "§5向いている方向へテレポートする",
            ]);
            endstoneSword.lockMode = ItemLockMode.inventory;
            
            inventory.setItem(slot, endstoneSword);
            
            player.dimension.playSound("random.levelup", player.location, { volume: 0.5, pitch: 1.5 });
            player.sendMessage("§e[クラフト] §eエンドストーンソード§fを作成しました！");
        }
    }
}
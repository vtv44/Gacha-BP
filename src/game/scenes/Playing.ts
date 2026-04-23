import { DisplaySlotId, EntityEquippableComponent, EquipmentSlot, ItemStack, Player, world } from '@minecraft/server';
import { Game } from 'game/Game';
import { GameScene } from 'game/GameScene';
import { PlayerData } from 'PlayerData';

const PHASE_2 = 120 * 20,
    PHASE_3 = 180 * 20,
    PHASE_4 = 240 * 20,
    PHASE_5 = 300 * 20;

export class Playing implements GameScene {
    private time: number;

    initialize(): void {
        this.time = 0;
        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: world.scoreboard.getObjective('game_info') });
    }

    onItemUse(player: Player, item: ItemStack): void {}

    onItemUseOn(player: Player, item: ItemStack): void {}

    passTick(): void {
        world.getAllPlayers().forEach((player) => {
            if (PlayerData.get(player).getLocation() !== 5) return;
            const equippable = player.getComponent(EntityEquippableComponent.componentId);
            if (!(equippable instanceof EntityEquippableComponent)) return;
            const itemSession = Game.getInstance().getItemSession();
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Mainhand));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Head));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Chest));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Legs));
            itemSession.register(player, equippable.getEquipment(EquipmentSlot.Feet));
        });
        if (this.time % 20 === 0) {
            switch (this.time) {
                case PHASE_2 - 60 * 20:
                    this.informAreaShrinkage(1, true, true);
                    break;
                case PHASE_2 - 20 * 20:
                    this.informAreaShrinkage(20);
                    break;
                case PHASE_3 - 20 * 20:
                case PHASE_4 - 20 * 20:
                    this.informAreaShrinkage(20, true);
                    break;
                case PHASE_2 - 10 * 20:
                case PHASE_3 - 10 * 20:
                case PHASE_4 - 10 * 20:
                    this.informAreaShrinkage(10);
                    break;
                case PHASE_2 - 5 * 20:
                case PHASE_3 - 5 * 20:
                case PHASE_4 - 5 * 20:
                    this.informAreaShrinkage(5);
                    break;
            }
            world.scoreboard.getObjective('game_info').setScore('timer', this.time / 20);
        }
        this.time++;
    }

    /**
     * @param displayTime デフォルト：秒
     */
    private informAreaShrinkage(displayTime, chime = false, minute = false) {
        world.getAllPlayers().forEach((player) => {
            if (minute) player.sendMessage(`§d${displayTime}分後エリア縮小...`);
            else player.sendMessage(`§d${displayTime}秒後エリア縮小...`);
            if (chime) player.playSound('block.bell.hit');
            else player.playSound('random.click');
        });
    }
}

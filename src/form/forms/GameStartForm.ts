import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';
import { Form } from '../Form';
import { EntityEquippableComponent, EquipmentSlot, Player } from '@minecraft/server';
import { Game } from 'game/Game';

export class GameStartForm extends Form {
    constructor() {
        super(
            new ModalFormData()
                .title('開始設定')
                .toggle('個人戦 / チーム戦')
                .toggle('ランダム / 投票')
                .dropdown(
                    '除外マップ',
                    Game.getInstance()
                        .getMapSelector()
                        .getMaps()
                        .map((m) => m.getName())
                )
                .submitButton('開始')
        );
    }

    replyProcess(player: Player, res: ModalFormResponse) {
        const { formValues, canceled } = res;
        if (canceled || typeof formValues[0] !== 'boolean' || typeof formValues[1] !== 'boolean' || typeof formValues[2] !== 'number') return;
        Game.getInstance().start(formValues[0], formValues[1], formValues[2]);
    }
}

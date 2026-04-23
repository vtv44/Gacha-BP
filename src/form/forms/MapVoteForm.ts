import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';
import { Form } from '../Form';
import { Player } from '@minecraft/server';
import { Game } from 'game/Game';
import { PlayerData } from 'PlayerData';

export class MapVoteForm extends Form {
    constructor(dropdownTitle: string = '清き一票を') {
        super(
            new ModalFormData().title('マップ投票').dropdown(
                dropdownTitle,
                Game.getInstance()
                    .getMapSelector()
                    .getAvailableMaps()
                    .map((m) => m.getName())
            )
        );
    }

    replyProcess(player: Player, res: ModalFormResponse) {
        const { formValues, canceled } = res;
        if (canceled) {
            PlayerData.get(player).showForm(new MapVoteForm('投票しやがれ！'));
            return;
        }
        if (typeof formValues[0] !== 'number') return;
    }
}

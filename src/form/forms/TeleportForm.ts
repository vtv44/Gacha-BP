import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { Form } from '../Form';
import { Player } from '@minecraft/server';

export class TeleportForm extends Form {
    constructor() {
        super(
            new ActionFormData()
                .title('tpします')
                .body('どこに行きますか')
                .button('ロビー')
                .button('コマンド部屋')
                .button('ガチャ（ATK）')
                .button('ガチャ（DEF）')
                .button('ガチャ（OMG）')
                .button('待機所')
                .button('表彰')
                .button('マップ（ハロウィン）')
                .button('マップ（妖精）')
                .button('マップ（クリスマス）')
                .button('マップ（アセント）')
                .button('マップ（Apex）')
        );
    }

    replyProcess(player: Player, res: ActionFormResponse) {
        const { selection, canceled } = res;
        if (canceled) return;
        switch (selection) {
            case 0:
                player.teleport({ x: 0, y: 68, z: 0 });
                break;
            case 1:
                player.teleport({ x: 192, y: 85, z: 0 });
                break;
            case 2:
                player.teleport({ x: 34, y: 84, z: 77 });
                break;
            case 3:
                player.teleport({ x: -18, y: 87, z: 77 });
                break;
            case 4:
                player.teleport({ x: -90, y: 83, z: 73 });
                break;
            case 5:
                player.teleport({ x: -72, y: 87, z: -49 });
                break;
            case 6:
                player.teleport({ x: 85, y: 77, z: -109 });
                break;
            case 7:
                player.teleport({ x: 0, y: 100, z: 700 });
                break;
            case 8:
                player.teleport({ x: 0, y: 100, z: 1400 });
                break;
            case 9:
                player.teleport({ x: 0, y: 100, z: 2100 });
                break;
            case 10:
                player.teleport({ x: 0, y: 250, z: 2800 });
                break;
            case 11:
                player.teleport({ x: 0, y: 130, z: 3500 });
                break;
        }
    }
}

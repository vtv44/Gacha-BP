import { Player, world } from '@minecraft/server';
import { ActionFormResponse, MessageFormResponse, ModalFormResponse } from '@minecraft/server-ui';
import { Form } from 'form/Form';

export class PlayerData {
    private static data = new Map<Player, PlayerData>();
    private player: Player;
    /**
     * 0:lobby, 1:atk, 2:def, 3:omg, 4:waiting, 5:playing, 6:spectating:
     */
    private location: number;

    constructor(player: Player) {
        this.player = player;
        this.location = 0;
    }

    static get(player: Player) {
        if (!this.data.has(player)) this.data.set(player, new PlayerData(player));
        return this.data.get(player);
    }

    showForm(form: Form) {
        form.getFormData()
            .show(this.player)
            .then((res: ActionFormResponse | ModalFormResponse | MessageFormResponse) => {
                form.replyProcess(this.player, res);
            });
    }

    moveLocation(location: number) {
        this.location = location;
        world.scoreboard.getObjective('location').setScore(this.player, location);
    }

    getLocation(): number {
        return this.location;
    }
}

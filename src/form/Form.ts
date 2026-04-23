import { Player } from '@minecraft/server';
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from '@minecraft/server-ui';

export abstract class Form {
    formData: ActionFormData | ModalFormData | MessageFormData;

    constructor(formData: ActionFormData | ModalFormData | MessageFormData) {
        this.formData = formData;
    }

    getFormData() {
        return this.formData;
    }

    abstract replyProcess(player: Player, res: ActionFormResponse | ModalFormResponse | MessageFormResponse);
}

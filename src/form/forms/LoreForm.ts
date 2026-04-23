import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';
import { Form } from '../Form';
import { EntityEquippableComponent, EquipmentSlot, Player } from '@minecraft/server';

export class LoreForm extends Form {
    constructor() {
        super(
            new ModalFormData()
                .title('説明つけます')
                .textField('', '')
                .textField('', '')
                .textField('', '')
                .textField('', '')
                .textField('', '')
                .textField('', '')
                .textField('', '')
        );
    }

    replyProcess(player: Player, res: ModalFormResponse) {
        const { formValues, canceled } = res;
        if (canceled) return;
        const equip = player.getComponent(EntityEquippableComponent.componentId);
        if (!(equip instanceof EntityEquippableComponent)) return;
        const item = equip.getEquipment(EquipmentSlot.Mainhand);
        if (typeof item === 'undefined') {
            player.sendMessage('お前はアイテムを持っていない');
            return;
        }
        const lores = formValues?.filter((val) => val !== '');
        let loresStr: any = [];
        loresStr = lores.map((l) => l as string);
        item.setLore(loresStr);
        equip.setEquipment(EquipmentSlot.Mainhand, item);
    }
}

import { GameStartForm } from './forms/GameStartForm';
import { LoreForm } from './forms/LoreForm';
import { TeleportForm } from './forms/TeleportForm';

export class Forms {
    static TELEPORT = new TeleportForm();
    static LORE = new LoreForm();
    static GAME_START = new GameStartForm();
}

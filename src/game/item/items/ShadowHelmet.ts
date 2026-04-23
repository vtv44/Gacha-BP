import { BlockVolume, MolangVariableMap, Player, world } from '@minecraft/server';
import { Item } from '../Item';
import { Util } from 'Util';
import { ItemNames } from '../ItemNames';
import { ItemWearable } from 'game/item/ItemWearable';
import { VECTOR3_DOWN, Vector3Builder, Vector3Utils } from '@minecraft/math';
import { MinecraftBlockTypes, MinecraftEffectTypes } from '@minecraft/vanilla-data';

const EFFECTED_BLOCK = MinecraftBlockTypes.BlackConcrete;
const SHADOW_COUNT_INTERVAL = 10;

export class ShadowHelmet extends Item implements ItemWearable {
    private shadowCount: number = 0; //-1で終了って感じ

    constructor(owner: Player) {
        super(ItemNames.SHADOW_HELMET, owner);
    }

    isFullEquipment(): boolean {
        return (
            Util.headItemName(this.owner, this.getName()) &&
            Util.chestItemName(this.owner, this.getName()) &&
            Util.legsItemName(this.owner, this.getName()) &&
            Util.feetItemName(this.owner, this.getName())
        );
    }

    passTick() {
        if (!this.isFullEquipment()) {
            this.resetShadowCount();
            return;
        }

        if (!this.owner.dimension.getBlock(Vector3Utils.add(this.owner.location, VECTOR3_DOWN)).isAir) {
            this.owner.dimension.setBlockType(Vector3Utils.add(this.owner.location, VECTOR3_DOWN), EFFECTED_BLOCK);
        }
        this.owner.dimension
            .getPlayers({ location: this.owner.location, maxDistance: 20 })
            .filter((p) => p.id !== this.owner.id && p.dimension.getBlock(p.location).matches(EFFECTED_BLOCK))
            .forEach((player) => {
                player.addEffect(MinecraftEffectTypes.Darkness, 20, { amplifier: 0, showParticles: false });
            });
        if (this.owner.dimension.getBlock(Vector3Utils.add(this.owner.location, VECTOR3_DOWN)).matches(EFFECTED_BLOCK)) {
            this.owner.addEffect(MinecraftEffectTypes.Speed, 20, { amplifier: 1, showParticles: false });
        }

        if (this.shadowCount === -1) return;
        if (this.owner.isSneaking) {
            this.shadowCount++;
        } else {
            this.resetShadowCount();
        }
        if (this.shadowCount % SHADOW_COUNT_INTERVAL === 0) {
            switch (this.shadowCount) {
                case 1 * SHADOW_COUNT_INTERVAL:
                case 2 * SHADOW_COUNT_INTERVAL:
                case 3 * SHADOW_COUNT_INTERVAL:
                case 4 * SHADOW_COUNT_INTERVAL:
                case 5 * SHADOW_COUNT_INTERVAL:
                case 6 * SHADOW_COUNT_INTERVAL:
                case 7 * SHADOW_COUNT_INTERVAL:
                case 8 * SHADOW_COUNT_INTERVAL:
                case 9 * SHADOW_COUNT_INTERVAL:
                case 10 * SHADOW_COUNT_INTERVAL:
                case 11 * SHADOW_COUNT_INTERVAL:
                    this.owner.playSound('random.click');
                    this.owner.dimension.spawnParticle('critical_hit_emitter', Vector3Utils.add(this.owner.location, new Vector3Builder(0, 2, 0)));
                    break;
                case 12 * SHADOW_COUNT_INTERVAL:
                    this.owner.playSound('portal.trigger');
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(0, -1, 0)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-0, -1, -0))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 13 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-1, -1, -1)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(1, -1, 1))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 14 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-2, -1, -2)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(2, -1, 2))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 15 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-3, -1, -3)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(3, -1, 3))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 16 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-4, -1, -4)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(4, -1, 4))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 17 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-5, -1, -5)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(5, -1, 5))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 18 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-6, -1, -6)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(6, -1, 6))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 19 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-7, -1, -7)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(7, -1, 7))
                        ),
                        EFFECTED_BLOCK
                    );
                    break;
                case 20 * SHADOW_COUNT_INTERVAL:
                    this.owner.dimension.fillBlocks(
                        new BlockVolume(
                            Vector3Utils.add(this.owner.location, new Vector3Builder(-8, -1, -8)),
                            Vector3Utils.add(this.owner.location, new Vector3Builder(8, -1, 8))
                        ),
                        EFFECTED_BLOCK
                    );
                    this.owner.runCommand(`execute rotated ~ 0 run fill ^7^^^8^2^4 ${EFFECTED_BLOCK}`);
                    this.owner.runCommand(`execute rotated ~ 0 run fill ^-7^^^-8^2^4 ${EFFECTED_BLOCK}`);
                    this.owner.runCommand(`execute rotated ~ 0 run fill ^3^^-2^6^3^-2 ${EFFECTED_BLOCK}`);
                    this.owner.runCommand(`execute rotated ~ 0 run fill ^-3^^-2^-6^3^-2 ${EFFECTED_BLOCK}`);
                    this.owner.runCommand(`execute rotated ~ 0 run fill ^4^^-4^3^2^-8 ${EFFECTED_BLOCK}`);
                    this.owner.runCommand(`execute rotated ~ 0 run fill ^-4^^-4^-3^2^-8 ${EFFECTED_BLOCK}`);
                    this.owner.runCommand(`execute rotated ~ 0 run fill ^-1^^-9^1^4^-9 ${EFFECTED_BLOCK}`);
                    this.owner.addEffect(MinecraftEffectTypes.Speed, 15 * 20, {
                        amplifier: 6,
                        showParticles: false,
                    });
                    this.owner.addEffect(MinecraftEffectTypes.Invisibility, 15 * 20, {
                        amplifier: 0,
                        showParticles: false,
                    });
                    this.owner.dimension.playSound('mob.enderdragon.growl', this.owner.location);
                    const molang = new MolangVariableMap();
                    molang.setColorRGB('color', { red: 0, green: 0, blue: 0 });
                    this.owner.dimension.spawnParticle('smash_ground_particle', this.owner.location, molang);
                    this.shadowCount = -1;
                    break;
            }
        }
    }

    private resetShadowCount() {
        if (this.shadowCount <= 0) return;
        if (this.shadowCount >= 120 && this.shadowCount < 200) {
            this.owner.playSound('random.fizz');
            this.owner.runCommand('stopsound @s portal.trigger');
        }
        this.shadowCount = 0;
    }
}

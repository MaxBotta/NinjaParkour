import { Player } from "../objects/index.js";

export class Menu extends Phaser.Scene {
    constructor() {
        super("menu");

        this.types = [
            "Mask Dude",
            "Ninja Frog",
            "Pink Man",
            "Virtual Guy"
        ]

        this.selectedType = 0;
    }

    preload() {
        for (let type of this.types) {
            this.load.spritesheet({
                key: 'player_' + type,
                url: `assets/PixelAdventure/Main Characters/${type}/Idle (32x32).png`,
                frameConfig: {
                    frameWidth: 32,
                    frameHeight: 32,
                    startFrame: 0,
                    endFrame: 10
                }
            });
        }
    }

    create() {

        for (let type of this.types) {
            this.anims.create({
                key: 'idle_' + type,
                frames: this.anims.generateFrameNumbers('player_' + type),
                frameRate: 20,
                repeat: -1
            });
        }

        this.player = this.physics.add.staticSprite(707, 420, this.types[this.selectedType]);
        this.player.play("idle_" + this.types[this.selectedType], false);
        this.player.setScale(3);

    }


}
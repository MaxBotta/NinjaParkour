

export class Trampoline extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x + 14, y - 14, 'trampoline');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(22, 14);
        this.body.setAllowGravity(false);
        this.body.offset.y = 18;
        this.body.offset.x = 2;

        this.jumpVelocity = -800;

        this.setImmovable(true);


        this.preload();
    }

    preload = () => {
        this.scene.load.spritesheet({
            key: 'trampoline_idle',
            url: `assets/PixelAdventure/Traps/Trampoline/Idle.png`,
            frameConfig: {
                frameWidth: 28,
                frameHeight: 28,
                startFrame: 0,
                endFrame: 0
            }
        });
        this.scene.load.spritesheet({
            key: 'trampoline_jump',
            url: `assets/PixelAdventure/Traps/Trampoline/Jump (28x28).png`,
            frameConfig: {
                frameWidth: 28,
                frameHeight: 28,
                startFrame: 0,
                endFrame: 8
            }
        });

        this.scene.load.once('complete', this.create, this.scene);
        this.scene.load.start();
    }

    create = () => {

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('trampoline_idle'),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('trampoline_jump'),
            frameRate: 20,
            repeat: 0
        });
        this.play("idle", false);
    }

    jump = (player) => {
        this.play("jump", false);
        this.chain("idle");
        player.setVelocityY(this.jumpVelocity);
    }
}
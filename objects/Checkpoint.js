

export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x + 32, y + 32, 'checkpoint');
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.body.setSize(64, 64);
        
        this.isChecked = false;

        this.preload();
    }

    preload = () => {
        this.scene.load.spritesheet({
            key: 'checkpoint_no_flag',
            url: `assets/PixelAdventure/Items/Checkpoints/Checkpoint/Checkpoint (No Flag).png`,
            frameConfig: {
                frameWidth: 64,
                frameHeight: 64,
                startFrame: 0,
                endFrame: 0
            }
        });
        this.scene.load.spritesheet({
            key: 'checkpoint_flag_idle',
            url: `assets/PixelAdventure/Items/Checkpoints/Checkpoint/Checkpoint (Flag Idle)(64x64).png`,
            frameConfig: {
                frameWidth: 64,
                frameHeight: 64,
                startFrame: 0,
                endFrame: 9
            }
        });
        this.scene.load.spritesheet({
            key: 'checkpoint_flag_out',
            url: `assets/PixelAdventure/Items/Checkpoints/Checkpoint/Checkpoint (Flag Out) (64x64).png`,
            frameConfig: {
                frameWidth: 64,
                frameHeight: 64,
                startFrame: 0,
                endFrame: 25
            }
        });

        this.scene.load.once('complete', this.create, this.scene);
        this.scene.load.start();
    }

    create = () => {

        this.anims.create({
            key: 'no_flag',
            frames: this.anims.generateFrameNumbers('checkpoint_no_flag'),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'flag_out',
            frames: this.anims.generateFrameNumbers('checkpoint_flag_out'),
            frameRate: 26,
            repeat: 0
        });
        this.anims.create({
            key: 'flag_idle',
            frames: this.anims.generateFrameNumbers('checkpoint_flag_idle'),
            frameRate: 20,
            repeat: -1
        });
        this.play("no_flag", false);
    }

    check = (player) => {

        if (this.isChecked) {
            return;
        }

        this.isChecked = true;
        this.play("flag_out", false);
        this.chain("flag_idle");
        // player.setCheckpoint();
    }
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, type, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.oldPos = { x: this.x, y: this.y };

        this.body.setSize(16, 28);
        // this.scaleY = 1;
        // this.scaleX = 1;

        this.type = type;
        this.life = 100;
        this.endurance = 100;
        this.runVelocity = 25;
        this.runFactor = 1;
        this.jumpVelocity = -400;

        this.isJumping = false;
        this.isDoubleJumping = false;
        this.isFalling = false;
        this.canJump = true;

        this.setCollideWorldBounds(true);
        this.preload();
    }

    preload = () => {
        this.scene.load.spritesheet({
            key: 'player_idle',
            url: `assets/PixelAdventure/Main Characters/${this.type}/Idle (32x32).png`,
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 12
            }
        });
        this.scene.load.spritesheet({
            key: 'player_run',
            url: `assets/PixelAdventure/Main Characters/${this.type}/Run (32x32).png`,
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 12
            }
        });
        this.scene.load.spritesheet({
            key: 'player_jump',
            url: `assets/PixelAdventure/Main Characters/${this.type}/Jump (32x32).png`,
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 0
            }
        });
        this.scene.load.spritesheet({
            key: 'player_double_jump',
            url: `assets/PixelAdventure/Main Characters/${this.type}/Double Jump (32x32).png`,
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 6
            }
        });
        this.scene.load.once('complete', this.create, this.scene);
        this.scene.load.start();
    }

    create = () => {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.scene.input.keyboard.disableGlobalCapture()
        this.upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.nameText = this.scene.add.text(this.x, this.y, 'Max', {
			fontFamily: 'Arial',
			fontSize: '10px',
			color: '#fff'
		});

        this.lifeRect = this.scene.add.rectangle(this.x, this.y - 30, this.life / 2, 4, 0x5CEE95);
        this.enduranceRect = this.scene.add.rectangle(this.x, this.y - 26, this.life / 2, 4, 0x5CD8EE);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player_idle'),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player_run'),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player_jump'),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'double_jump',
            frames: this.anims.generateFrameNumbers('player_double_jump'),
            frameRate: 20,
            repeat: -1
        });

        this.play("idle");
        console.log(this)
        this.scene.events.on('update', (t, dt) => { this.update(t, dt) });


    }

    update = (t, dt) => {

        const speed = this.runVelocity * this.runFactor * dt;

        // check if player is falling
        if (this.body.velocity.y < 0) {
            this.isJumping = true;
            this.body.checkCollision.none = true;
        } else {
            this.body.checkCollision.none = false;
        }

        // check if player is jumping
        if (this.body.velocity.y > 0) {
            this.play("jump", true);
            this.isJumping = true;
        }

        // Jumping
        if (this.canJump && (!this.isJumping || !this.isDoubleJumping) && Phaser.Input.Keyboard.JustDown(this.upKey)) {

            if (!this.isJumping) {
                this.isJumping = true;
                this.play("jump", true);
            } else if (!this.isDoubleJumping) {
                this.isDoubleJumping = true;
                this.play("double_jump", true);
            }
            this.setVelocityY(this.jumpVelocity);

            this.canJump = false;
            setTimeout(() => {
                this.canJump = true;
            }, 200);
        }

        //Resetting jump variables
        if ((this.isJumping || this.isDoubleJumping) && this.body.blocked.down) {
            this.isJumping = false;
            this.isDoubleJumping = false;
        }


        // Moving left and right
        if (this.cursors.left.isDown) {
            this.flipX = true;
            this.setVelocityX(-speed);
            if (!this.isJumping) this.play("run", true);
        }
        else if (this.cursors.right.isDown) {
            this.flipX = false;
            this.setVelocityX(speed)
            if (!this.isJumping) this.play("run", true);
        }
        else {
            if (!this.isJumping) this.play("idle", true);
            this.setVelocityX(0)
        }


        this.nameText.setPosition(this.x - 10, this.y - 30);
        this.lifeRect.setPosition(this.x, this.y - 24);
        this.enduranceRect.setPosition(this.x, this.y - 20);


    }

}
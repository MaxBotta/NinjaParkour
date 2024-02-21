
export class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() { 
        this.load.image("terrain", "assets/PixelAdventure/Terrain/Terrain (16x16).png");
        this.load.image("ice", "assets/PixelAdventure/Traps/Sand Mud Ice/Sand Mud Ice (16x6).png");
        this.load.image("spikes", "assets/PixelAdventure/Traps/Spikes/Idle.png")
        this.load.image("spikes", "assets/PixelAdventure/Traps/Trampoline/Idle.png")
        // this.load.tilemapTiledJSON("level_1", "assets/level_1.json")
        this.load.tilemapTiledJSON("level_2", "assets/level_2.json")

        // this.load.atlas("player", "character/texture.png", "character/player.json");

    }

    create() {
        this.scene.start("game");
    }

}
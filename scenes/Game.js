
import { Player } from "../objects/index.js";
import { Trampoline } from "../objects/index.js";
import { Checkpoint } from "../objects/index.js";


export class Game extends Phaser.Scene {

    constructor() {
        super("game");

        this.player = null;
        this.trampolines = [];
        this.checkpoints = [];
        this.spawnPoint = {};
        this.spikeTiles = [];
        this.counter = 0;
    }

    startCounter = () => {
        this.counterInterval = setInterval(() => {
            this.counter++;
        }, 1000);
    }

    create = () => {

        console.log(this)

        const map = this.make.tilemap({ key: 'level_2', tileWidth: 16, tileHeight: 16 });
        const terrain = map.addTilesetImage("terrain", "terrain");
        const ice = map.addTilesetImage("ice", "ice");

        const terrainLayer = map.createLayer("terrain", terrain);
        const iceLayer = map.createLayer("ice", ice);
        const spikes = map.addTilesetImage("spikes", "spikes");
        const spikesLayer = map.createLayer("spikes", spikes);


        // Go through all the object layers and add them to the scene

        const spawn = map.filterObjects('spawn', obj => obj.name === 'spawn');
        this.spawnPoint = spawn[0];

        this.player = new Player(this, "Virtual Guy", this.spawnPoint.x, this.spawnPoint.y);

        //create trampolines
        // const trampolines = map.createFromObjects('trampoline', { name: "trampoline", key: "trampoline" });
        const trampolineObjects = map.filterObjects('trampoline', obj => obj.name === 'trampoline');
        for (let t of trampolineObjects) {
            const trampoline = new Trampoline(this, t.x, t.y);
            this.trampolines.push(trampoline);
        }

        //create checkpoints
        const checkpoints = map.filterObjects('checkpoint', obj => obj.name === 'checkpoint');
        for (let c of checkpoints) {
            const checkpoint = new Checkpoint(this, c.x, c.y);
            this.checkpoints.push(checkpoint);
        }

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //collision with trampolines
        this.physics.add.collider(this.player, this.trampolines, (p, t) => {
            t.jump(this.player);
        })

        //collision with checkpoints
        this.physics.add.overlap(this.player, this.checkpoints, (p, c) => {
            c.check(this.player);
        })

        //collision with spikes
        this.spikeTiles = map.filterTiles(tile => tile.properties.kill === true);
        console.log("🚀 ~ file: Game.js:76 ~ Game ~ spikeTiles:", this.spikeTiles)
        this.spikeTiles = this.spikeTiles.map(tile => {
            tile.baseWidth = 16;
            tile.baseHeight = 8;
        });
        spikesLayer.setCollisionByProperty({ kill: true });
        this.physics.add.collider(this.player, spikesLayer, (p, s) => {
            this.player.hit();
        })

        terrainLayer.setCollisionByProperty({ collide: true });
        this.physics.add.collider(this.player, terrainLayer);
        iceLayer.setCollisionByProperty({ collide: true });
        this.physics.add.collider(this.player, iceLayer);

        console.log("🚀 ~ file: Game.js:38 ~ Game ~ spikesLayer:", spikesLayer)


        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.6);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const scoreText = this.add.text(100 * 1.6 + 60, 110 * 1.6, 'TIME: ' + this.counter, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#fff'
        })
        scoreText.setScrollFactor(0)

    }

    update() {
        //check if player collides with spikes
        // this.physics.world.overlapTiles(this.player, this.spikeTiles, this.player.hit);

    }

}

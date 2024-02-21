
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
        this.timer = 0;
        this.timerStarted = false;
        this.counter = 0;
        this.counterStarted = false;
        this.raceStarted = false;
        this.timeScores = [];
    }

    startRace = () => {
        this.raceStarted = true;
    }

    startCounter = () => {
        this.startCounterInterval = setInterval(() => {
            this.counter++;

            if (this.counter === 4) {
                this.resetStartCounter
                this.startRace();
                this.startTimer();
            }
        }, 1000);
    }

    resetCounter = () => {
        clearInterval(this.counterInterval);
        this.counter = 0;
    }

    startTimer = () => {
        this.timer = 0;
        if (this.timerStarted) return;
        this.timerStarted = true;
        this.timerInterval = setInterval(() => {
            this.timer++;
        }, 1);
    }

    stopTimer = () => {
        clearInterval(this.timerInterval);
        this.timeScores.push(this.timer);
        this.timerStarted = false;
    }

    create = () => {

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

        //Add trampolines to the scene
        const trampLayer = map.getObjectLayer('trampoline');
        for (let t of trampLayer.objects) {
            const trampoline = new Trampoline(this, t.x, t.y);
            this.trampolines.push(trampoline);
        }

        //collision with trampolines
        this.physics.add.collider(this.player, this.trampolines, (p, t) => {
            t.jump(this.player);
        })

        //Add checkpoints to the scene
        const checkLayer = map.getObjectLayer('checkpoint');
        for (let c of checkLayer.objects) {
            if (c.name === "start") this.startPoint = new Checkpoint(this, "start", c.x, c.y);
            if (c.name === "end") this.endPoint = new Checkpoint(this, "end", c.x, c.y);
        }

        //collision with checkpoints
        this.physics.add.overlap(this.player, this.startPoint, (p, c) => {
            this.startTimer();
        })

    
        this.physics.add.overlap(this.player, this.endPoint, (p, c) => {
            console.log("stop")
            this.stopTimer();
        })


        //collision with spikes
        this.spikeTiles = map.filterTiles(tile => tile.properties.kill === true);
        // this.spikeTiles = this.spikesLayer.tilemapLayer.getTilesWithin().forEach(tile => {
        //     tile.baseWidth = 16;
        //     tile.baseHeight = 8;
        // });
        spikesLayer.setCollisionByProperty({ kill: true });
        this.physics.add.collider(this.player, spikesLayer, (p, s) => {
            this.player.hit();
        })

        terrainLayer.setCollisionByProperty({ collide: true });
        this.physics.add.collider(this.player, terrainLayer);
        iceLayer.setCollisionByProperty({ collide: true });
        this.physics.add.collider(this.player, iceLayer);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.6);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.timerText = this.add.text(100 * 1.6 + 60, 110 * 1.6, 'TIME: ' + this.timer, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#fff'
        })
        this.timerText.setScrollFactor(0)

        // this.startCounterText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 20, this.counter, {
        //     fontFamily: 'Arial',
        //     fontSize: '60px',
        //     color: '#fff'
        // })
        // this.startCounterText.setScrollFactor(0)

    }

    update() {
        //check if player collides with spikes
        // this.physics.world.overlapTiles(this.player, this.spikeTiles, this.player.hit);

        // if(this.raceStarted) {
        //     this.startCounterText.setVisible(false);
        // }

        // if(!this.counterStarted) {
        //     this.counterStarted = true;
        //     this.startCounter();
        // }

        // this.startCounterText.setText(this.counter)
        this.timerText.setText(this.timer / 1000);

    }

}

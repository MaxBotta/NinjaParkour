import { Preloader, Game, Menu } from "./scenes/index.js";

export default new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: 1600,
    height: 1600,
    backgroundColor: 'rgb(0, 200, 255)',
    physics: {
        fps: 60,
        default: 'arcade',
        arcade: {
            gravity: { y: 1000},
            // debug: true,
            tileBias: 20,
        }
    },
    scene: [Preloader, Menu, Game],
    scale: {
        mode: Phaser.Scale.FIT,
        zoom: 1,
        width: "100%",
        height: "100%",
	}
});
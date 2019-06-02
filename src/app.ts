import "phaser";
import { Level } from './level'

const config: any = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 500
    },
    fps: { target: 60 },
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: [Level]
}

const game = new Phaser.Game(config);


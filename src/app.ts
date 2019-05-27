import "phaser";
import { Level } from './level'

const config: any = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    fps: { target: 60 },
    backgroundColor: 'b9eaff',
    parent: "game",
    physics: {
        default: 'arcade',
    },
    scene: [Level]
}

const game = new Phaser.Game(config);
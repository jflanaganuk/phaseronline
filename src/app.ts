import "phaser";
import { Level } from './level'

const config: any = {
    type: Phaser.AUTO,
    width: 500,
    height: 600,
    fps: { target: 60 },
    backgroundColor: 'b9eaff',
    physics: {
        default: 'arcade',
    },
    scene: [Level]
}

const game = new Phaser.Game(config);
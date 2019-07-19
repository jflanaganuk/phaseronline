
export const config = {
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 500
    },
    fps: { target: 60 },
    pixelArt: true,
    scene: {},
    physics: {
        default: 'arcade',
    },
}

export const gameState = {
    speed: 200,
    player: {}
}

export const config = {
    type: Phaser.HEADLESS,
    parent: "game",
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
    },
    autoFocus: false,
    scene: {}
}

export const gameState = {
    speed: 200,
    rollModifier: 2,
    rollLength: 400,
    rollCooldown: 1000
};
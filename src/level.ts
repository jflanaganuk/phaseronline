import { gameState } from './gameState';

export class Level extends Phaser.Scene {
    constructor() {
        super('level');
    }
    preload(){
        this.load.spritesheet('player', '/assets/player.png', {
            frameWidth: 16,
            frameHeight: 16
        })

    }
    create(){
        gameState.player = this.physics.add.sprite(200, 200, 'player');
        this.createAnimations();
        gameState.cursors = this.input.keyboard.createCursorKeys();
    }
    update(){
        if (gameState.cursors.right.isDown){
            gameState.player.flipX = false;
            gameState.player.setVelocityX(gameState.speed);
        } else if (gameState.cursors.left.isDown){
            gameState.player.flipX = true;
            gameState.player.setVelocityX(-gameState.speed);
        } else {
            gameState.player.setVelocityX(0);
        }

        if (gameState.cursors.up.isDown){
            gameState.player.setVelocityY(-gameState.speed);
        } else if (gameState.cursors.down.isDown){
            gameState.player.setVelocityY(gameState.speed);
        } else {
            gameState.player.setVelocityY(0);
        }

        if (gameState.cursors.up.isUp && gameState.cursors.down.isUp && gameState.cursors.left.isUp && gameState.cursors.right.isUp) {
            gameState.player.anims.play('idle', true);
        } else {
            gameState.player.anims.play('run', true);
        }
    }
    createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 0}),
            frameRate: 10,
            repeat: -1
        })
    }
}
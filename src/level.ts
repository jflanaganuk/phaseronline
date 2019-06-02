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
        this.load.image("tiles", "../assets/entities.png");
        this.load.tilemapTiledJSON("map", "../assets/leveldata/start.json");

    }
    create(){
        const map = this.make.tilemap({ key: "map"});
        const tileset = map.addTilesetImage("entities", "tiles");
        const belowLayer = map.createStaticLayer("below layer", tileset, 0, 0).setScale(2);
        const mainLayer = map.createStaticLayer("main layer", tileset, 0, 0).setScale(2);
        mainLayer.setCollisionByProperty({collides: true});
        belowLayer.setCollisionByProperty({collides: true});
        
        const spawnPoint: any = map.findObject("objects", obj => obj.name === "spawnpoint");
        gameState.player = this.physics.add.sprite(spawnPoint.x * 2, spawnPoint.y * 2, 'player').setScale(2);
        this.createAnimations();
        gameState.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(gameState.player, mainLayer);
        this.physics.add.collider(gameState.player, belowLayer);

        const camera = this.cameras.main;
        camera.startFollow(gameState.player);
        camera.setBounds(0, 0, 1600, 1600);
        
        const aboveLayer = map.createStaticLayer("above layer", tileset, 0, 0).setScale(2);
    }
    update(){
        gameState.player.body.setVelocity(0);
        if (gameState.cursors.right.isDown){
            gameState.player.flipX = false;
            gameState.player.body.setVelocityX(gameState.speed);
        } else if (gameState.cursors.left.isDown){
            gameState.player.flipX = true;
            gameState.player.body.setVelocityX(-gameState.speed);
        } else {
            gameState.player.body.setVelocityX(0);
        }

        if (gameState.cursors.up.isDown){
            gameState.player.body.setVelocityY(-gameState.speed);
        } else if (gameState.cursors.down.isDown){
            gameState.player.body.setVelocityY(gameState.speed);
        } else {
            gameState.player.body.setVelocityY(0);
        }

        if (gameState.cursors.up.isUp && gameState.cursors.down.isUp && gameState.cursors.left.isUp && gameState.cursors.right.isUp) {
            gameState.player.anims.play('idle', true);
        } else {
            gameState.player.anims.play('run', true);
        }

        gameState.player.body.velocity.normalize().scale(gameState.speed);
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
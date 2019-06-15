const Phaser = require("phaser");
const io = require("socket.io-client");

const config = {
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
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: 'arcade',
    },
}

const gameState = {
    speed: 200
}

function preload(){
    this.load.spritesheet('player', '../assets/player.png', {
        frameWidth: 16,
        frameHeight: 16
    })
    this.load.image("tiles", "../assets/entities.png");
    this.load.tilemapTiledJSON("map", "../assets/leveldata/start.json");
}

function create(){

    const self = this;
    this.socket = io();
    this.players = this.add.group();

    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("entities", "tiles");
    const belowLayer = map.createStaticLayer("below layer", tileset, 0, 0).setScale(2);
    const mainLayer = map.createStaticLayer("main layer", tileset, 0, 0).setScale(2);
    mainLayer.setCollisionByProperty({collides: true});
    belowLayer.setCollisionByProperty({collides: true});
    

    const aboveLayer = map.createStaticLayer("above layer", tileset, 0, 0).setScale(2);
    createAnimations(this.anims);

    this.socket.on('currentPlayers', function(players) {
        Object.keys(players).forEach(function (id){
            if (players[id].playerId === self.socket.id) {
                displayPlayers(self, players[id], 'player', self.socket);
            } else {
                displayPlayers(self, players[id], 'player', self.socket); // TODO - this will need changing to otherPlayer
            }
        });
    });

    this.socket.on('newPlayer', function(playerInfo) {
        displayPlayers(self, playerInfo, 'player', self.socket); // TODO - this will need changing to otherPlayer
    });

    this.socket.on('disconnect', function (playerId) {
        self.players.getChildren().forEach(function (player) {
            if (playerId === player.playerId) {
                player.destroy();
            }
        });
    });

    this.socket.on('playerUpdates', function (players) {
        Object.keys(players).forEach(function(id) {
            self.players.getChildren().forEach(function (player) {
                if (players[id].playerId === player.playerId) {
                    player.setPosition(players[id].x, players[id].y);

                    if (!players[id].input.up && !players[id].input.down && !players[id].input.left && !players[id].input.right) {
                        player.anims.play('idle', true);
                    } else {
                        player.anims.play('run', true);
                        if (players[id].input.left) {
                            player.flipX = true;
                        } else {
                            player.flipX = false;
                        }
                    }
                }
            });
        });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    this.downKeyPressed = false;
}

function update(){

    const left = this.leftKeyPressed;
    const right = this.rightKeyPressed;
    const up = this.upKeyPressed;
    const down = this.downKeyPressed;

    if (this.cursors.left.isDown) {
        gameState.player.flipX = true;
        this.leftKeyPressed = true;
    } else if (this.cursors.right.isDown) {
        gameState.player.flipX = false;
        this.rightKeyPressed = true;
    } else {
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
    }

    if (this.cursors.up.isDown) {
        this.upKeyPressed = true;
    } else if (this.cursors.down.isDown) {
        this.downKeyPressed = true;
    } else {
        this.upKeyPressed = false;
        this.downKeyPressed = false;
    }

    if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down !== this.downKeyPressed) {
        this.socket.emit('playerInput', {
            left: this.leftKeyPressed,
            right: this.rightKeyPressed,
            up: this.upKeyPressed,
            down: this.downKeyPressed
        });
    }

}

function createAnimations(anims) {
    anims.create({
        key: 'run',
        frames: anims.generateFrameNumbers('player', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('player', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
}

function displayPlayers(self, playerInfo, sprite, socket){
    const player = self.add.sprite(playerInfo.x * 2, playerInfo.y * 2, sprite).setScale(2);
    player.playerId = playerInfo.playerId;
    self.players.add(player);

    if (playerInfo.playerId === socket.id) {
        gameState.player = player;
        const camera = self.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, 1600, 1600);
    }
}

const game = new Phaser.Game(config);

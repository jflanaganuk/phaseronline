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
    this.load.spritesheet('player', '../assets/player.png', { frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('playerMoveDown', '../assets/TopDownCharacter/Character/Character_Down.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerMoveLeft', '../assets/TopDownCharacter/Character/Character_Left.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerMoveRight', '../assets/TopDownCharacter/Character/Character_Right.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerMoveUp', '../assets/TopDownCharacter/Character/Character_Up.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerMoveDownLeft', '../assets/TopDownCharacter/Character/Character_DownLeft.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerMoveDownRight', '../assets/TopDownCharacter/Character/Character_DownRight.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerMoveUpLeft', '../assets/TopDownCharacter/Character/Character_UpLeft.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerMoveUpRight', '../assets/TopDownCharacter/Character/Character_UpRight.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('spawnEffect', '../assets/boltsequence.png', {frameWidth: 80, frameHeight: 80});
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
                        if (players[id].direction === "up") {
                            player.anims.play('idleUp', true);
                        } else if (players[id].direction === "left") {
                            player.anims.play('idleLeft', true);
                        } else if (players[id].direction === "right") {
                            player.anims.play('idleRight', true);
                        } else if (players[id].direction === "upLeft") {
                            player.anims.play('idleUpLeft', true);
                        } else if (players[id].direction === "upRight") {
                            player.anims.play('idleUpRight', true);
                        } else if (players[id].direction === "downLeft") {
                            player.anims.play('idleDownLeft', true);
                        } else if (players[id].direction === "downRight") {
                            player.anims.play('idleDownRight', true);
                        } else {
                            player.anims.play('idleDown', true);
                        }
                    } else if (players[id].input.up) {
                        if (players[id].input.left) {
                            player.anims.play('moveUpLeft', true);
                        } else if (players[id].input.right) {
                            player.anims.play('moveUpRight', true);
                        } else {
                            player.anims.play('moveUp', true);
                        }
                    } else if (players[id].input.down) {
                        if (players[id].input.left) {
                            player.anims.play('moveDownLeft', true);
                        } else if (players[id].input.right) {
                            player.anims.play('moveDownRight', true);
                        } else {
                            player.anims.play('moveDown', true);
                        }
                    } else if (players[id].input.left) {
                        player.anims.play('moveLeft', true);
                    } else if (players[id].input.right) {
                        player.anims.play('moveRight', true);
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
        this.leftKeyPressed = true;
    } else if (this.cursors.right.isDown) {
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
        key: 'moveRight',
        frames: anims.generateFrameNumbers('playerMoveRight', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'moveLeft',
        frames: anims.generateFrameNumbers('playerMoveLeft', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'moveUp',
        frames: anims.generateFrameNumbers('playerMoveUp', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'moveDown',
        frames: anims.generateFrameNumbers('playerMoveDown', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'moveDownLeft',
        frames: anims.generateFrameNumbers('playerMoveDownLeft', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'moveDownRight',
        frames: anims.generateFrameNumbers('playerMoveDownRight', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'moveUpLeft',
        frames: anims.generateFrameNumbers('playerMoveUpLeft', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'moveUpRight',
        frames: anims.generateFrameNumbers('playerMoveUpRight', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })

    anims.create({
        key: 'idleRight',
        frames: anims.generateFrameNumbers('playerMoveRight', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idleLeft',
        frames: anims.generateFrameNumbers('playerMoveLeft', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idleUp',
        frames: anims.generateFrameNumbers('playerMoveUp', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idleDown',
        frames: anims.generateFrameNumbers('playerMoveDown', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idleDownLeft',
        frames: anims.generateFrameNumbers('playerMoveDownLeft', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idleDownLeft',
        frames: anims.generateFrameNumbers('playerMoveDownLeft', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idleUpLeft',
        frames: anims.generateFrameNumbers('playerMoveUpLeft', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idleUpRight',
        frames: anims.generateFrameNumbers('playerMoveUpRight', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    })

    anims.create({
        key: 'spawnLightning',
        frames: anims.generateFrameNumbers('spawnEffect', {start: 0, end: 21}),
        frameRate: 24,
        repeat: 0
    });
}

function displayPlayers(self, playerInfo, sprite, socket){
    const player = self.add.sprite(playerInfo.x * 2, playerInfo.y * 2, sprite).setScale(2);
    player.playerId = playerInfo.playerId;
    self.players.add(player);

    const spawnEffect = self.add.sprite(playerInfo.x, playerInfo.y - 10, 'spawnEffect');
    spawnEffect.anims.play('spawnLightning');
    spawnEffect.on('animationcomplete', function(){
        this.destroy();
    })

    if (playerInfo.playerId === socket.id) {
        gameState.player = player;
        const camera = self.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, 1600, 1600);
    }
}

const game = new Phaser.Game(config);

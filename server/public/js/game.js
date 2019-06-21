const Phaser = require("phaser");
const io = require("socket.io-client");

const config = {
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

    this.load.spritesheet('playerRollRight', '../assets/TopDownCharacter/Character/Character_RollRight.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerRollLeft', '../assets/TopDownCharacter/Character/Character_RollLeft.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerRollUp', '../assets/TopDownCharacter/Character/Character_RollUp.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerRollDown', '../assets/TopDownCharacter/Character/Character_RollDown.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerRollUpRight', '../assets/TopDownCharacter/Character/Character_RollUpRight.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerRollUpLeft', '../assets/TopDownCharacter/Character/Character_RollUpLeft.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerRollDownRight', '../assets/TopDownCharacter/Character/Character_RollDownRight.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerRollDownLeft', '../assets/TopDownCharacter/Character/Character_RollDownLeft.png', {frameWidth: 32, frameHeight: 32});

    this.load.image("tiles", "../assets/entities.png");
    this.load.image("fullscreen", "../assets/fullscreen.png");
    this.load.tilemapTiledJSON("map", "../assets/leveldata/start.json");
    this.load.plugin('rexvirtualjoystickplugin', './public/js/virtualjoystick.min.js', true);
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

    const fullscreenButton = this.add.sprite(750, 50, 'fullscreen');
    fullscreenButton.setInteractive();
    fullscreenButton.setScrollFactor(0);
    fullscreenButton.on('pointerup', () => {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    })

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
                const { x, y, direction, input, playerId, rolling, canRoll } = players[id];
                if (playerId === player.playerId) {
                    player.setPosition(x, y);

                    if (!input.up && !input.down && !input.left && !input.right) {
                        if (direction === "up") {
                            player.anims.play('idleUp', true);
                        } else if (direction === "left") {
                            player.anims.play('idleLeft', true);
                        } else if (direction === "right") {
                            player.anims.play('idleRight', true);
                        } else if (direction === "upLeft") {
                            player.anims.play('idleUpLeft', true);
                        } else if (direction === "upRight") {
                            player.anims.play('idleUpRight', true);
                        } else if (direction === "downLeft") {
                            player.anims.play('idleDownLeft', true);
                        } else if (direction === "downRight") {
                            player.anims.play('idleDownRight', true);
                        } else {
                            player.anims.play('idleDown', true);
                        }
                    } else if (input.up) {
                        if (input.left) {
                            if (rolling) {
                                player.anims.play('rollUpLeft', true);
                            } else {
                                player.anims.play('moveUpLeft', true);
                            }
                        } else if (input.right) {
                            if (rolling) {
                                player.anims.play('rollUpRight', true);
                            } else {
                                player.anims.play('moveUpRight', true);
                            }
                        } else {
                            if (rolling) {
                                player.anims.play('rollUp', true);
                            } else {
                                player.anims.play('moveUp', true);
                            }
                        }
                    } else if (input.down) {
                        if (input.left) {
                            if (rolling) {
                                player.anims.play('rollDownLeft', true);
                            } else {
                                player.anims.play('moveDownLeft', true);
                            }
                        } else if (input.right) {
                            if (rolling) {
                                player.anims.play('rollDownRight', true);
                            } else {
                                player.anims.play('moveDownRight', true);
                            }
                        } else {
                            if (rolling) {
                                player.anims.play('rollDown', true);
                            } else {
                                player.anims.play('moveDown', true);
                            }
                        }
                    } else if (input.left) {
                        if (rolling) {
                            player.anims.play('rollLeft', true);
                        } else {
                            player.anims.play('moveLeft', true);
                        }
                    } else if (input.right) {
                        if (rolling) {
                            player.anims.play('rollRight', true);
                        } else {
                            player.anims.play('moveRight', true);
                        }
                    }
                }
            });
        });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    //Test for devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 125,
            y: 350,
            radius: 100,
            base: this.add.graphics().fillStyle(0x888888).fillCircle(0, 0, 100),
            thumb: this.add.graphics().fillStyle(0xcccccc).fillCircle(0, 0, 50),
            forceMin: 32
        });
        this.joystickKeys = this.joyStick.createCursorKeys();
        this.virtualShiftKey = this.add.graphics().fillStyle(0xcccccc).fillCircle(config.scale.width - 100, config.scale.height - 100, 50);
        this.virtualShiftKey.setScrollFactor(0);
        this.virtualShiftKey.setInteractive(new Phaser.Geom.Circle(config.scale.width - 100, config.scale.height - 100, 50), () => {});
    } else {
        this.joystickKeys = {
            left: {
                isDown: false
            },
            right: {
                isDown: false
            },
            up: {
                isDown: false
            },
            down: {
                isDown: false
            },
        }
    }
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    this.downKeyPressed = false;
    this.shiftKeyPressed = false;
}

function update(){

    const left = this.leftKeyPressed;
    const right = this.rightKeyPressed;
    const up = this.upKeyPressed;
    const down = this.downKeyPressed;
    const shift = this.shiftKeyPressed;

    if (this.cursors.left.isDown || this.joystickKeys.left.isDown) {
        this.leftKeyPressed = true;
    } else if (this.cursors.right.isDown || this.joystickKeys.right.isDown) {
        this.rightKeyPressed = true;
    } else {
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
    }

    if (this.cursors.up.isDown || this.joystickKeys.up.isDown) {
        this.upKeyPressed = true;
    } else if (this.cursors.down.isDown || this.joystickKeys.down.isDown) {
        this.downKeyPressed = true;
    } else {
        this.upKeyPressed = false;
        this.downKeyPressed = false;
    }

    if (this.cursors.shift.isDown) { // TODO - add touch button
        this.shiftKeyPressed = true;
    } else {
        this.shiftKeyPressed = false;
    }

    if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down !== this.downKeyPressed || shift !== this.shiftKeyPressed) {
        this.socket.emit('playerInput', {
            left: this.leftKeyPressed,
            right: this.rightKeyPressed,
            up: this.upKeyPressed,
            down: this.downKeyPressed,
            shift: this.shiftKeyPressed
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
        key: 'rollRight',
        frames: anims.generateFrameNumbers('playerRollRight', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });
    anims.create({
        key: 'rollLeft',
        frames: anims.generateFrameNumbers('playerRollLeft', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });
    anims.create({
        key: 'rollUp',
        frames: anims.generateFrameNumbers('playerRollUp', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });
    anims.create({
        key: 'rollDown',
        frames: anims.generateFrameNumbers('playerRollDown', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });
    anims.create({
        key: 'rollUpRight',
        frames: anims.generateFrameNumbers('playerRollUpRight', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });
    anims.create({
        key: 'rollUpLeft',
        frames: anims.generateFrameNumbers('playerRollUpLeft', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });
    anims.create({
        key: 'rollDownRight',
        frames: anims.generateFrameNumbers('playerRollDownRight', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });
    anims.create({
        key: 'rollDownLeft',
        frames: anims.generateFrameNumbers('playerRollDownLeft', {start: 0, end: 3}),
        frameRate: 10,
        repeat: 0
    });

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

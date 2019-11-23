import Phaser from 'phaser';
import io from 'socket.io-client';
import { PlayerType, PlayersType, InputType, SceneWithPlayersType, SceneWithPlayersAndInputType, PlayerImageType, EnemiesType, ItemsType, ItemType, InventoryType } from '../../shared/types';
import { assetLoader } from './objects/assetLoader';
import { config, gameState } from './objects/constants';
import { createAnimations } from './objects/animationCreator';
import { onPlayerUpdate, displayPlayers } from './objects/playerController';
import { processInputs } from './objects/inputController';
import { displayEnemies, onEnemyUpdate } from './objects/enemyController';
import { displayItem } from './objects/itemsController';

config.scene = {
    preload,
    create,
    update
}
declare global {
    interface Window { debugObj: any }
}

function preload(this: SceneWithPlayersType){
    assetLoader(this);
}

function create(this: SceneWithPlayersAndInputType){

    const self = this;
    window.debugObj = self;
    this.socket = io();
    this.players = this.add.group();
    this.enemies = this.add.group();
    this.items = this.add.group();

    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("entities", "tiles", 16, 16, 1, 2);
    const belowLayer = map.createStaticLayer("below layer", tileset, 0, 0).setScale(2);
    const mainLayer = map.createStaticLayer("main layer", tileset, 0, 0).setScale(2);
    mainLayer.setCollisionByProperty({collides: true});
    belowLayer.setCollisionByProperty({collides: true});

    const aboveLayer = map.createStaticLayer("above layer", tileset, 0, 0).setScale(2);
    createAnimations(this.anims);
    aboveLayer.setDepth(1);

    this.input.addPointer(3);

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

    this.socket.on('currentPlayers', function(players: PlayersType) {
        Object.keys(players).forEach(function (id){
            if (players[id].playerId === self.socket.id) {
                displayPlayers(self, players[id], 'player', self.socket, gameState);
            } else {
                displayPlayers(self, players[id], 'player', self.socket, gameState); // TODO - this will need changing to otherPlayer
            }
        });
    });

    this.socket.on('currentEnemies', function(enemies: EnemiesType) {
        Object.keys(enemies).forEach(function (id){
            displayEnemies(self, enemies[id], 'enemy');
        });
    });

    this.socket.on('currentItems', function(items: ItemsType) {
        Object.keys(items).forEach(function (id){
            displayItem(self, items[id]);
        });
    });

    this.socket.on('newPlayer', function(playerInfo: PlayerType) {
        displayPlayers(self, playerInfo, 'player', self.socket, gameState); // TODO - this will need changing to otherPlayer
    });

    this.socket.on('disconnect', function (playerId: string) {
        self.players.getChildren().forEach(function (player: PlayerType) {
            if (playerId === player.playerId) {
                const spawnEffect = self.add.sprite(player.x, player.y - 10, 'spawnEffect');
                spawnEffect.anims.playReverse('spawnLightning');
                spawnEffect.on('animationcomplete', function(this: PlayerType){
                    this.destroy && this.destroy();
                    player.destroy && player.destroy();
                });
            }
        });
    });

    this.socket.on('playerUpdates', function (players: PlayersType) {
        onPlayerUpdate(players, self);
    });

    this.socket.on('enemyUpdates', function (enemies: EnemiesType){
        onEnemyUpdate(enemies, self);
    });

    this.socket.on('itemRemove', function (itemId: string) {
        self.items.getChildren().forEach((item: ItemType) => {
            if (itemId === item.itemId) {
                item.destroy && item.destroy();
            }
        })
    });

    this.socket.on('inventoryUpdate', function(payload: {playerId: string; inventory: InventoryType[]}){
        if (payload.playerId === self.socket.id) {
            console.log(payload.inventory);// TODO - this is only logging so the client can see updates
        }
    });

    this.socket.on('inventoryToggle', function(payload: {playerId: string, opened: boolean}){
        if (payload.playerId === self.socket.id) {
            if (payload.opened) {
                console.log("Inventory Open");
            } else {
                console.log("Inventory Closed");
            }
        }
    });

    this.cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        pickup: Phaser.Input.Keyboard.KeyCodes.E,
        inventory: Phaser.Input.Keyboard.KeyCodes.I,
    });
    this.virtualKeys = {
        shift: {
            isDown: false
        },
        pickup: {
            isDown: false
        },
        inventory: {
            isDown: false
        }
    }
    //Test for devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin');
        this.joyStick.add(this, {
            x: 125,
            y: 350,
            radius: 100,
            base: this.add.graphics().fillStyle(0x888888).fillCircle(0, 0, 100),
            thumb: this.add.graphics().fillStyle(0xcccccc).fillCircle(0, 0, 50),
            forceMin: 32
        });
        this.joyStickKeys = this.joyStick.createCursorKeys();
        this.virtualShiftKey = this.add.sprite(config.scale.width - 100, config.scale.height - 100, 'button').setScale(2);
        this.virtualShiftKey.setScrollFactor(0);
        this.virtualShiftKey.setInteractive();
        this.virtualShiftKey.on('pointerdown', () => {
            this.virtualKeys.shift.isDown = true;
        })
    } else {
        this.joyStickKeys = {
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
    this.pickupKeyPressed = false;
    this.inventoryKeyPressed = false;
}

function update(this: SceneWithPlayersAndInputType){
    processInputs(this);
}

const game = new Phaser.Game(config);

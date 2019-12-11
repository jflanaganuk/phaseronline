import Phaser from 'phaser';
import { Socket } from 'socket.io';
import { PlayerType, PlayersType, InputType, SceneWithPlayersType, SpawnPointType, EnemiesType, EnemySpawnsType, EnemyType, Direction, CustomProperty, ItemsType, ItemSpawnsType, ItemTypeEnum, ItemType, ItemPayload, SwordsType } from '../../shared/types';
import { assetLoader } from './objects/assetLoader';
import { config, gameState } from './objects/constants';
import { addPlayer, removePlayer, handlePlayerInput, handleEquipItem, addSword, removeSword } from './objects/playerController';
import { addEnemy, removeEnemy } from './objects/enemyController';
import { addItem, removeItem } from './objects/itemsController';
declare global {
    interface Window { io: any, gameLoaded: any }
}
window.io = window.io || {};
window.gameLoaded = window.gameLoaded || {};

const { io } = window;

const players: PlayersType = {};
const enemies: EnemiesType = {};
const items: ItemsType = {};
const swords: SwordsType = {};

function preload(this: Phaser.Scene){
    assetLoader(this);
}

config.scene = {
    preload,
    create,
    update
}

function create(this: SceneWithPlayersType){
    const self = this;
    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("entities", "tiles");
    const belowLayer = map.createStaticLayer("below layer", tileset, 0, 0).setScale(2);
    belowLayer.setCollisionByProperty({collides: true});
    const spawnPoint: SpawnPointType = map.findObject("objects", (obj: {name: string}) => obj.name === "spawnpoint");
    const enemyPoints: EnemySpawnsType = map.filterObjects("objects", (obj: {name: string}) => obj.name === "enemy");
    const itemPoints: ItemSpawnsType = map.filterObjects("objects", (obj: {name: string}) => obj.name === "item");

    this.players = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.items = this.physics.add.group();
    this.swords = this.physics.add.group();

    enemyPoints.forEach((enemy: SpawnPointType) => {
        const stringIndex = enemy.id || "idNotDefined";
        const directionObj: CustomProperty | false = enemy.properties && enemy.properties.filter(property => property.name === "direction")[0] || false;
        enemies[stringIndex] = {
            x: enemy.x ? enemy.x * 2 : 0,
            y: enemy.y ? enemy.y * 2 : 0,
            direction: directionObj && directionObj.value as Direction || Direction.d,
            enemyId: stringIndex
        }
        addEnemy(self, enemies[stringIndex]);
    });

    itemPoints.forEach((item: SpawnPointType) => {
        const stringIndex = item.id || "idNotDefined";
        items[stringIndex] = {
            x: item.x ? item.x * 2 : 0,
            y: item.y ? item.y * 2 : 0,
            type: item.type as ItemTypeEnum,
            pickedUp: false,
            itemId: stringIndex
        }
        addItem(self, items[stringIndex]);
    });

    io.on('connection', function(socket: Socket){
        console.log('a user connected');

        const id = socket.id;
        players[id] = {
            x: spawnPoint.x ? spawnPoint.x * 2 : 0,
            y: spawnPoint.y ? spawnPoint.y * 2 : 0,
            playerId: socket.id,
            input: {
                left: false,
                right: false,
                up: false,
                down: false,
                shift: false,
                pickup: false,
                inventory: false,
                swing: false,
            },
            rolling: false,
            canRoll: true,
            swinging: false,
            canSwing: true,
            inventory: [],
            inventoryTick: true,
            inventoryOpened: false,
            equipment: {
                ammo: false,
                main: false,
                ranged: false
            }
        }

        addPlayer(self, players[id]);

        socket.emit('currentPlayers', players);
        socket.emit('currentEnemies', enemies);
        socket.emit('currentItems', items);
        socket.broadcast.emit('newPlayer', players[id]);

        socket.on('disconnect', function(){
            console.log('user disconnected');
            removePlayer(self, socket.id);
            delete players[id];
            io.emit('disconnect', socket.id);
        });

        socket.on('playerInput', function (inputData: InputType) {
            handlePlayerInput(self, socket.id, inputData, players);
        })

        socket.on('equipItemToPlayer', function(payload: ItemPayload){
            const success: boolean = handleEquipItem(self, socket.id, payload, players);
            if (success) socket.emit('equippedItemToPlayer', {id: socket.id, item: payload});
        });

        socket.on('requestPingCheck', function(payload: {id: string; time: number}){
            io.emit('sendPingCheck', payload);
        });
    })
    this.physics.add.collider(this.players, belowLayer);
    this.physics.add.collider(this.enemies, belowLayer, (obj: Phaser.GameObjects.GameObject & {enemyId?: string}) => {
        const enemyId = obj.enemyId;
        this.enemies.getChildren().forEach((enemy: EnemyType) => {
            if (enemy.enemyId === enemyId) {
                switch (enemy.direction) {
                    case Direction.d:
                        enemy.direction = Direction.u;
                        break;
                    case Direction.u:
                        enemy.direction = Direction.d;
                        break;
                    case Direction.l:
                        enemy.direction = Direction.r;
                        break;
                    case Direction.r:
                        enemy.direction = Direction.l;
                        break;
                }
            }
        });
    });

    this.physics.add.overlap(this.players, this.items, (player: Phaser.GameObjects.GameObject & {playerId?: string}, item: Phaser.GameObjects.GameObject & {itemId?: string}) => {
        const itemType = item.type;
        const itemId = item.itemId;
        const playerId = player.playerId;

        this.players.getChildren().forEach((player: PlayerType) => {
            const id = player.playerId;
            if (id === playerId) {
                const { input } = players[id];
                if (input.pickup) {
                    this.items.getChildren().forEach((item: ItemType) => {
                        const id = item.itemId;
                        if (id === itemId) {
                            const invPlayerId = player.playerId;
                            if (players[invPlayerId].inventory.find(item => item.itemType === itemType)) {
                                const index = players[invPlayerId].inventory.findIndex(item => item.itemType === itemType);
                                players[invPlayerId].inventory[index].amount++;
                            } else {
                                players[invPlayerId].inventory.push({
                                    itemType: itemType,
                                    amount: 1,
                                });
                            }
                            removeItem(this, itemId);
                            delete items[id];
                            io.emit('itemRemove', id);
                        }
                    });
                }
            }
        });
    });

    this.physics.add.overlap(this.players, this.swords, (player: Phaser.GameObjects.GameObject & {playerId?: string}, sword: Phaser.GameObjects.GameObject & {playerId?: string}) => {
        const swordId = sword.playerId;
        const playerId = player.playerId;

        this.players.getChildren().forEach((player: PlayerType) => {
            const id = player.playerId;
            if (id === playerId) {
                if (id !== swordId) {
                    console.log(`${swordId} hit ${id}!`);
                }
            }
        })
    });

    this.physics.add.overlap(this.enemies, this.swords, (enemy: Phaser.GameObjects.GameObject & { enemyId?: string }, sword: Phaser.GameObjects.GameObject & { playerId?: string }) => {
        const swordId = sword.playerId;
        const enemyId = enemy.enemyId;

        this.enemies.getChildren().forEach((enemy: EnemyType) => {
            const id = enemy.enemyId;
            if (id === enemyId) {
                removeEnemy(self, id);
                delete enemies[id];
                io.emit('deleteEnemy', id);
            }
        });
    });
}

let previousTimeStamp = 0;
const fps = 1000/60;
function update(this: SceneWithPlayersType){
    if ((previousTimeStamp + fps) < performance.now()) {
        previousTimeStamp += fps;

        this.players.getChildren().forEach((player: PlayerType) => {
            const id = player.playerId;
            const { input, rolling, canRoll, swinging, canSwing, equipment } = players[id];
            if (input.shift && !rolling && canRoll) {
                players[id].rolling = true;
                players[id].canRoll = false;
                setTimeout(() => {
                    players[id].rolling = false;
                }, gameState.rollLength);
                setTimeout(() => {
                    players[id].canRoll = true;
                }, gameState.rollCooldown);
            }

            if (input.swing && !swinging && canSwing && equipment.main) {
                players[id].swinging = true;
                players[id].canSwing = false;
                addSword(this, players[id], players[id].direction || Direction.d);
                const emitObj = {
                    direction: players[id].direction || Direction.d,
                    playerId: players[id].playerId,
                    x: players[id].x,
                    y: players[id].y,
                };
                io.emit('newSword', emitObj);
                swords[players[id].playerId] = emitObj;
                setTimeout(() => {
                    players[id].swinging = false;
                    removeSword(this, players[id].playerId);
                    delete swords[players[id].playerId];
                }, gameState.swingLength);
                setTimeout(() => {
                    players[id].canSwing = true;
                }, gameState.swingCooldown);
            }

            swords[players[id].playerId] && (swords[players[id].playerId].x = players[id].x);
            swords[players[id].playerId] && (swords[players[id].playerId].y = players[id].y);

            if (input.inventory) {
                if (players[id].inventoryTick) {
                    players[id].inventoryOpened = !players[id].inventoryOpened;
                    players[id].inventoryTick = false;
                    io.emit('inventoryToggle', {playerId: id, opened: players[id].inventoryOpened, inventory: players[id].inventory});
                }
            } else {
                if (!players[id].inventoryTick) {
                    players[id].inventoryTick = true;
                }
            }

            const speed = (rolling) ? gameState.speed * gameState.rollModifier : gameState.speed;
            if (!player.body) return;

            let xSpeed = 0;
            if (input.left) {
                xSpeed -= speed;
            }
            if (input.right) {
                xSpeed += speed;
            }
            player.body.setVelocityX(xSpeed);

            let ySpeed = 0;
            if (input.up) {
                ySpeed -= speed;
            } 
            if (input.down) {
                ySpeed += speed;
            } 
            player.body.setVelocityY(ySpeed);

            player.body.velocity.normalize().scale(speed);

            players[id].x = player.x;
            players[id].y = player.y;
        })

        this.enemies.getChildren().forEach((enemy: EnemyType) => {
            const id = enemy.enemyId;
            const speed = 50;
            if (!enemy.body) return;
            if (enemy.direction === Direction.u) enemy.body.setVelocityY(-speed);
            if (enemy.direction === Direction.d) enemy.body.setVelocityY(speed);
            if (enemy.direction === Direction.r) enemy.body.setVelocityX(speed);
            if (enemy.direction === Direction.l) enemy.body.setVelocityX(-speed);

            enemies[id].x = enemy.x;
            enemies[id].y = enemy.y;
        });

        io.emit('playerUpdates', players);
        io.emit('enemyUpdates', enemies);
        io.emit('swordUpdates', swords);
    }

}

const game = new Phaser.Game(config);
window.gameLoaded();

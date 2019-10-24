import Phaser from 'phaser';
import { Socket } from 'socket.io';
import { PlayerType, PlayersType, InputType, SceneWithPlayersType, SpawnPointType, PlayerImageType, EnemiesType, EnemySpawnsType, EnemyType } from '../../shared/types';
import { assetLoader } from './objects/assetLoader';
import { config, gameState } from './objects/constants';
import { addPlayer, removePlayer, handlePlayerInput } from './objects/playerController';
import { addEnemy } from './objects/enemyController';
declare global {
    interface Window { io: any, gameLoaded: any }
}
window.io = window.io || {};
window.gameLoaded = window.gameLoaded || {};

const { io } = window;

const players: PlayersType = {};
const enemies: EnemiesType = {};

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
    const enemyPoints: EnemySpawnsType = map.filterObjects("objects", (obj: {name: string}) => obj.name === "Enemy");

    this.players = this.physics.add.group();
    this.enemies = this.physics.add.group();

    enemyPoints.forEach((enemy: SpawnPointType, index: number) => {
        const stringIndex = String(index);
        enemies[stringIndex] = {
            x: enemy.x ? enemy.x * 2 : 0,
            y: enemy.y ? enemy.y * 2 : 0,
            enemyId: stringIndex
        }
        addEnemy(self, enemies[stringIndex]);
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
                shift: false
            },
            rolling: false,
            canRoll: true
        }

        addPlayer(self, players[id]);

        socket.emit('currentPlayers', players);
        socket.emit('currentEnemies', enemies);
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
    })
    this.physics.add.collider(this.players, belowLayer);
}

function update(this: SceneWithPlayersType){

    this.players.getChildren().forEach((player: PlayerType) => {
        const id = player.playerId;
        const { input, rolling, canRoll } = players[id];
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

        const speed = (rolling) ? gameState.speed * gameState.rollModifier : gameState.speed;
        if (!player.body) return;
        if (input.left) {
            player.body.setVelocityX(-speed);
        } else if (input.right) {
            player.body.setVelocityX(speed);
        } else {
            player.body.setVelocityX(0);
        }

        if (input.up) {
            player.body.setVelocityY(-speed);
        } else if (input.down) {
            player.body.setVelocityY(speed);
        } else {
            player.body.setVelocityY(0);
        }

        player.body.velocity.normalize().scale(speed);

        players[id].x = player.x;
        players[id].y = player.y;
    })

    this.enemies.getChildren().forEach((enemy: EnemyType) => {
        const id = enemy.enemyId;
        if (!enemy.body) return;
        enemy.body.setVelocityY(5);

        enemies[id].x = enemy.x;
        enemies[id].y = enemy.y;
    });

    io.emit('playerUpdates', players);
    io.emit('enemyUpdates', enemies);
}

const game = new Phaser.Game(config);
window.gameLoaded();

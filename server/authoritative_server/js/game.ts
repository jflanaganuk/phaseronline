import Phaser from 'phaser';
import { Socket } from 'socket.io';
import { PlayerType, PlayersType, InputType, SceneWithPlayersType, SpawnPointType, PlayerImageType } from '../../shared/types';

declare global {
    interface Window { io: any, gameLoaded: any }
}
window.io = window.io || {};
window.gameLoaded = window.gameLoaded || {};

const { io } = window;

const players: PlayersType = {};

const config = {
    type: Phaser.HEADLESS,
    parent: "game",
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
    },
    autoFocus: false,
    scene: {
        preload,
        create,
        update
    }
}

const gameState = {
    speed: 200,
    rollModifier: 2,
    rollLength: 400,
    rollCooldown: 1000
};

function preload(this: Phaser.Scene){
    this.load.spritesheet('player', '../assets/TopDownCharacter/Character/Character_Right.png', {
        frameWidth: 16,
        frameHeight: 16
    })
    this.load.image("tiles", "../assets/entities.png");
    this.load.tilemapTiledJSON("map", "../assets/leveldata/start.json");

}


function create(this: SceneWithPlayersType){
    const self = this;
    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("entities", "tiles");
    const belowLayer = map.createStaticLayer("below layer", tileset, 0, 0).setScale(2);
    belowLayer.setCollisionByProperty({collides: true});
    

    const spawnPoint: SpawnPointType = map.findObject("objects", (obj: {name: string}) => obj.name === "spawnpoint");

    this.players = this.physics.add.group();
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
        socket.broadcast.emit('newPlayer', players[id]);

        socket.on('disconnect', function(){
            console.log('user disconnected');
            removePlayer(self, socket.id);
            delete players[id];
            io.emit('disconnect', socket.id);
        });

        socket.on('playerInput', function (inputData: InputType) {
            handlePlayerInput(self, socket.id, inputData);
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
    io.emit('playerUpdates', players);
}

function addPlayer(self: SceneWithPlayersType, playerInfo: PlayerType){
    const player: PlayerImageType = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setScale(2);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
}

function removePlayer(self: SceneWithPlayersType, playerId: string){
    self.players.getChildren().forEach((player: PlayerType) => {
        if (playerId === player.playerId) {
            player.destroy && player.destroy();
        }
    })
}

function handlePlayerInput(self: SceneWithPlayersType, playerId: string, input: InputType){
    self.players.getChildren().forEach((player: PlayerType) => {
        if (playerId === player.playerId) {
            const id = player.playerId;
            players[id].input = input;
            if (players[id].input.up) {
                if (players[id].input.left){
                    players[id].direction = "upLeft";
                } else if (players[id].input.right) {
                    players[id].direction = "upRight";
                } else {
                    players[id].direction = "up";
                }
            } else if (players[id].input.down) {
                if (players[id].input.left){
                    players[id].direction = "downLeft";
                } else if (players[id].input.right) {
                    players[id].direction = "downRight";
                } else {
                    players[id].direction = "down";
                }
            } else if (players[id].input.left) {
                players[id].direction = "left";
            } else if (players[id].input.right) {
                players[id].direction = "right";
            }
        }
    })
}

const game = new Phaser.Game(config);
window.gameLoaded();

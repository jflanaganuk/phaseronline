const Phaser = require("phaser");

const players = {};

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
    speed: 200
};

function preload(){
    this.load.spritesheet('player', './assets/player.png', {
        frameWidth: 16,
        frameHeight: 16
    })
    this.load.image("tiles", "./assets/entities.png");
    this.load.tilemapTiledJSON("map", "./assets/leveldata/start.json");

}

function create(){
    const self = this;
    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("entities", "tiles");
    const belowLayer = map.createStaticLayer("below layer", tileset, 0, 0).setScale(2);
    belowLayer.setCollisionByProperty({collides: true});
    
    const spawnPoint = map.findObject("objects", obj => obj.name === "spawnpoint");

    this.players = this.physics.add.group();
    io.on('connection', function(socket){
        console.log('a user connected');

        players[socket.id] = {
            x: spawnPoint.x,
            y: spawnPoint.y,
            playerId: socket.id,
            input: {
                left: false,
                right: false,
                up: false,
                down: false
            }
        }

        addPlayer(self, players[socket.id]);

        socket.emit('currentPlayers', players);
        socket.broadcast.emit('newPlayer', players[socket.id]);

        socket.on('disconnect', function(){
            console.log('user disconnected');
            removePlayer(self, socket.id);
            delete players[socket.id];
            io.emit('disconnect', socket.id);
        });

        socket.on('playerInput', function (inputData) {
            handlePlayerInput(self, socket.id, inputData);
        })
    })
    this.physics.add.collider(this.players, belowLayer);
    this.physics.add.collider(this.players);
}

function update(){

    this.players.getChildren().forEach((player) => {
        const input = players[player.playerId].input;
        if (input.left) {
            player.body.setVelocityX(-gameState.speed);
        } else if (input.right) {
            player.body.setVelocityX(gameState.speed);
        } else {
            player.body.setVelocityX(0);
        }

        if (input.up) {
            player.body.setVelocityY(-gameState.speed);
        } else if (input.down) {
            player.body.setVelocityY(gameState.speed);
        } else {
            player.body.setVelocityY(0);
        }

        player.body.velocity.normalize().scale(gameState.speed);

        players[player.playerId].x = player.x;
        players[player.playerId].y = player.y;
    })
    io.emit('playerUpdates', players);
}

function addPlayer(self, playerInfo){
    const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setScale(2);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
}

function removePlayer(self, playerId){
    self.players.getChildren().forEach((player) => {
        if (playerId === player.playerId) {
            player.destroy();
        }
    })
}

function handlePlayerInput(self, playerId, input){
    self.players.getChildren().forEach((player) => {
        if (playerId === player.playerId) {
            players[player.playerId].input = input;
        }
    })
}

const game = new Phaser.Game(config);
window.gameLoaded();


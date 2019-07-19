import { PlayersType, PlayerType, SceneWithPlayersAndInputType, PlayerImageType } from "../../../shared/types";

export function onPlayerUpdate(players: PlayersType, context: SceneWithPlayersAndInputType) {
    Object.keys(players).forEach(function(id) {
        context.players.getChildren().forEach(function (player: PlayerType) {
            const { x, y, direction, input, playerId, rolling, canRoll } = players[id];
            if (playerId === player.playerId && player.anims) {
                player.setPosition && player.setPosition(x, y);

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
}

export function displayPlayers(self: SceneWithPlayersAndInputType, playerInfo: PlayerType, sprite: string, socket: any, gameState: any){
    const player: PlayerImageType = self.add.sprite(playerInfo.x * 2, playerInfo.y * 2, sprite).setScale(2);
    player.playerId = playerInfo.playerId;
    self.players.add(player);

    const spawnEffect = self.add.sprite(playerInfo.x, playerInfo.y - 10, 'spawnEffect');
    spawnEffect.anims.play('spawnLightning');
    spawnEffect.on('animationcomplete', function(this: PlayerType){
        this.destroy && this.destroy();
    })

    if (playerInfo.playerId === socket.id) {
        gameState.player = player;
        const camera = self.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, 1600, 1600);
    }
}

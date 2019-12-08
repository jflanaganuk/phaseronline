import { PlayersType, PlayerType, SceneWithPlayersAndInputType, PlayerImageType, SwordsType, SwordType, SwordImageType, Direction } from "../../../shared/types";

export function onPlayerUpdate(players: PlayersType, context: SceneWithPlayersAndInputType) {
    Object.keys(players).forEach(function(id) {
        context.players.getChildren().forEach(function (player: PlayerType) {
            const { x, y, direction, input, playerId, rolling, swinging } = players[id];
            if (playerId === player.playerId && player.anims) {
                player.setPosition && player.setPosition(x, y);

                if (!input.up && !input.down && !input.left && !input.right) {
                    if (direction === "up") {
                        if (!swinging) player.anims.play('idleUp', true);
                        if (swinging) player.anims.play('swipeUp', true);
                    } else if (direction === "left") {
                        if (!swinging) player.anims.play('idleLeft', true);
                        if (swinging) player.anims.play('swipeLeft', true);
                    } else if (direction === "right") {
                        if (!swinging) player.anims.play('idleRight', true);
                        if (swinging) player.anims.play('swipeRight', true);
                    } else if (direction === "upLeft") {
                        if (!swinging) player.anims.play('idleUpLeft', true);
                        if (swinging) player.anims.play('swipeLeft', true);
                    } else if (direction === "upRight") {
                        if (!swinging) player.anims.play('idleUpRight', true);
                        if (swinging) player.anims.play('swipeRight', true);
                    } else if (direction === "downLeft") {
                        if (!swinging) player.anims.play('idleDownLeft', true);
                        if (swinging) player.anims.play('swipeLeft', true);
                    } else if (direction === "downRight") {
                        if (!swinging) player.anims.play('idleDownRight', true);
                        if (swinging) player.anims.play('swipeRight', true);
                    } else {
                        if (!swinging) player.anims.play('idleDown', true);
                        if (swinging) player.anims.play('swipeDown', true);
                    }
                } else if (input.up) {
                    if (input.left) {
                        if (rolling) {
                            player.anims.play('rollUpLeft', true);
                        } else if (swinging) {
                            player.anims.play('swipeLeft', true);
                        } else {
                            player.anims.play('moveUpLeft', true);
                        }
                    } else if (input.right) {
                        if (rolling) {
                            player.anims.play('rollUpRight', true);
                        } else if (swinging) {
                            player.anims.play('swipeRight', true);
                        } else {
                            player.anims.play('moveUpRight', true);
                        }
                    } else {
                        if (rolling) {
                            player.anims.play('rollUp', true);
                        } else if (swinging) {
                            player.anims.play('swipeUp', true);
                        } else {
                            player.anims.play('moveUp', true);
                        }
                    }
                } else if (input.down) {
                    if (input.left) {
                        if (rolling) {
                            player.anims.play('rollDownLeft', true);
                        } else if (swinging) {
                            player.anims.play('swipeLeft', true);
                        } else {
                            player.anims.play('moveDownLeft', true);
                        }
                    } else if (input.right) {
                        if (rolling) {
                            player.anims.play('rollDownRight', true);
                        } else if (swinging) {
                            player.anims.play('swipeRight', true);
                        } else {
                            player.anims.play('moveDownRight', true);
                        }
                    } else {
                        if (rolling) {
                            player.anims.play('rollDown', true);
                        } else if (swinging) {
                            player.anims.play('swipeDown', true);
                        } else {
                            player.anims.play('moveDown', true);
                        }
                    }
                } else if (input.left) {
                    if (rolling) {
                        player.anims.play('rollLeft', true);
                    } else if (swinging) {
                        player.anims.play('swipeLeft', true);
                    } else {
                        player.anims.play('moveLeft', true);
                    }
                } else if (input.right) {
                    if (rolling) {
                        player.anims.play('rollRight', true);
                    } else if (swinging) {
                        player.anims.play('swipeRight', true);
                    } else {
                        player.anims.play('moveRight', true);
                    }
                }
            }
        });
    });
}

export function onSwordUpdate(swords: SwordsType, self: SceneWithPlayersAndInputType) {
    Object.keys(swords).forEach((id) => {
        self.swords.getChildren().forEach(function(sword: SwordType){
            const {x, y} = swords[id];
            sword.setPosition && sword.setPosition(x, y);
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

export function displaySwords(self: SceneWithPlayersAndInputType, swordInfo: SwordType, sprite: string) {
    const sword = self.add.sprite(swordInfo.x, swordInfo.y, sprite).setScale(2);
    const direction = () => {
        switch (swordInfo.direction) {
            case Direction.d:
            case Direction.dl:
            case Direction.dr:
                return 'swordDown';
            case Direction.u:
            case Direction.ul:
            case Direction.ur:
                return 'swordUp';
            case Direction.l:
                return 'swordLeft';
            case Direction.r:
                return 'swordRight';
        }
    }
    self.swords.add(sword);
    sword.anims.play(direction());
    sword.on('animationcomplete', function(this: SwordType){
        this.destroy && this.destroy();
        self.swords.remove(sword);
    });
}

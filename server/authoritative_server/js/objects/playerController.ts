import { SceneWithPlayersType, PlayerType, PlayerImageType, InputType, PlayersType } from "../../../shared/types";

export function addPlayer(self: SceneWithPlayersType, playerInfo: PlayerType){
    const player: PlayerImageType = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setScale(2);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
}

export function removePlayer(self: SceneWithPlayersType, playerId: string){
    self.players.getChildren().forEach((player: PlayerType) => {
        if (playerId === player.playerId) {
            player.destroy && player.destroy();
        }
    })
}

export function handlePlayerInput(self: SceneWithPlayersType, playerId: string, input: InputType, players: PlayersType){
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

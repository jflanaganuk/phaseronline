import { SceneWithPlayersType, PlayerType, PlayerImageType, InputType, PlayersType, Direction, ItemPayload, SwordImageType, SwordType } from "../../../shared/types";

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
                    players[id].direction = Direction.ul;
                } else if (players[id].input.right) {
                    players[id].direction = Direction.ur;
                } else {
                    players[id].direction = Direction.u;
                }
            } else if (players[id].input.down) {
                if (players[id].input.left){
                    players[id].direction = Direction.dl;
                } else if (players[id].input.right) {
                    players[id].direction = Direction.dr;
                } else {
                    players[id].direction = Direction.d;
                }
            } else if (players[id].input.left) {
                players[id].direction = Direction.l;
            } else if (players[id].input.right) {
                players[id].direction = Direction.r;
            }
        }
    })
}

const itemDatabase = require('../../../shared/item_database.json');

export function handleEquipItem(self: SceneWithPlayersType, playerId: string, item: ItemPayload, players: PlayersType): boolean {
    let success = false;
    self.players.getChildren().forEach((player: PlayerType) => {
        if (player.playerId === playerId) {
            const id = player.playerId;
            const itemInfo = itemDatabase[item.type];
            players[id].equipment[item.kind] = {
                damage: itemInfo.damage,
                description: itemInfo.description,
                equip_type: item.kind,
                item_name: item.type,
                readable_name: itemInfo.readable_name,
                speed: itemInfo.speed,
                stackable: itemInfo.stackable
            }
            success = true;
        }
    });
    return success;
}

export function addSword(self: SceneWithPlayersType, player: PlayerType, direction: Direction) {
    const xOffset = () => {
        switch(direction) {
            case Direction.dl:
            case Direction.l:
            case Direction.ul:
                return -16;
            case Direction.dr:
            case Direction.r:
            case Direction.ur:
                return 16;
            case Direction.u:
            case Direction.d:
                return 0;
        }
    }
    const yOffset = () => {
        switch(direction) {
            case Direction.dl:
            case Direction.d:
            case Direction.dr:
                return 16;
            case Direction.ul:
            case Direction.u:
            case Direction.ur:
                return -16;
            case Direction.l:
            case Direction.r:
                return 0;
        }
    }
    const sword: SwordImageType = self.physics.add.image(player.x + xOffset(), player.y + yOffset(), 'swordHitbox').setScale(2);
    sword.playerId = player.playerId;
    self.swords.add(sword);
}

export function removeSword(self: SceneWithPlayersType, swordId: string) {
    self.swords.getChildren().forEach((sword: SwordType) => {
        if (swordId === sword.playerId) {
            sword.destroy && sword.destroy();
        }
    });
}

import Phaser from 'phaser';

export type InputType = {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    shift: boolean;
};

export type PlayerType = {
    x: number;
    y: number;
    playerId: string;
    input: InputType;
    rolling: boolean;
    canRoll: boolean;
    destroy?(): void;
    setPosition?(x: number, y: number): void;
    body?: Phaser.Physics.Arcade.Body;
    direction?: string;
    anims?: {
        play(key: string, child: boolean): void;
    };
}

export type PlayersType = {
    [key: string]: PlayerType
}

export type SceneWithPlayersType = Phaser.Scene & {
    players: any;
    socket?: any;
}

export type SceneWithPlayersAndInputType = SceneWithPlayersType & {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    virtualKeys: {
        shift: {
            isDown: boolean;
        }
    };
    joyStick: any;
    joyStickKeys: Phaser.Types.Input.Keyboard.CursorKeys | {
        left: {
            isDown: boolean
        };
        right: {
            isDown: boolean
        };
        up: {
            isDown: boolean
        };
        down: {
            isDown: boolean
        };
    };
    virtualShiftKey: Phaser.GameObjects.Image;
    leftKeyPressed: boolean;
    rightKeyPressed: boolean;
    upKeyPressed: boolean;
    downKeyPressed: boolean;
    shiftKeyPressed: boolean;
};

export type SpawnPointType = Phaser.GameObjects.GameObject & {
    x?: number;
    y?: number;
}

export type PlayerImageType = (Phaser.Physics.Arcade.Image | Phaser.GameObjects.Image) & {
    playerId?: string;
}
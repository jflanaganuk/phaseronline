import Phaser from 'phaser';

export enum Direction {
    u = 'up',
    ul = 'upLeft',
    ur = 'upRight',
    d = 'down',
    dl = 'downLeft',
    dr = 'downRight',
    l = 'left',
    r = 'right'
}

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
    direction?: Direction;
    anims?: {
        play(key: string, child: boolean): void;
    };
}

export type PlayersType = {
    [key: string]: PlayerType
}

export type EnemyType = {
    x: number;
    y: number;
    enemyId: string;
    direction: Direction;
    destroy?(): void;
    setPosition?(x: number, y: number): void;
    body?: Phaser.Physics.Arcade.Body;
    anims?: {
        play(key: string, child: boolean): void;
    };
}

export type EnemiesType = {
    [key: string]: EnemyType;
}

export type SceneWithPlayersType = Phaser.Scene & {
    players: any;
    enemies: any;
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
    type?: string;
    properties?: CustomProperty[];
}

export type CustomProperty = {
    name: string;
    type: string;
    value: string;
}

export type EnemySpawnsType = (Phaser.GameObjects.GameObject & {
    x?: number;
    y?: number;
})[];

export type PlayerImageType = (Phaser.Physics.Arcade.Image | Phaser.GameObjects.Image) & {
    playerId?: string;
}

export type EnemyImageType = (Phaser.Physics.Arcade.Image | Phaser.GameObjects.Image) & {
    enemyId?: string;
    direction?: Direction;
}

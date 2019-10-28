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

export enum ItemTypeEnum {
    sword = 'sword',
    arrow = 'arrow',
    bow = 'bow',
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

export type ItemType = {
    x: number;
    y: number;
    itemId: string;
    type: ItemTypeEnum;
    pickedUp: boolean;
    destroy?(): void;
}

export type ItemsType = {
    [key:string]: ItemType;
}

export type SceneWithPlayersType = Phaser.Scene & {
    players: any;
    enemies: any;
    items: any;
    socket?: any;
}

export type SceneWithPlayersAndInputType = SceneWithPlayersType & {
    cursors: CustomCursorKeys;
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
    id?: string;
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
    id?: string;
    x?: number;
    y?: number;
})[];

export type ItemSpawnsType = (Phaser.GameObjects.GameObject & {
    id?: string;
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

export type ItemImageType = (Phaser.Physics.Arcade.Image | Phaser.GameObjects.Image) & {
    itemId?: string;
}

export type CustomCursorKeys = {
    up?: Phaser.Input.Keyboard.Key;
    down?: Phaser.Input.Keyboard.Key;
    left?: Phaser.Input.Keyboard.Key;
    right?: Phaser.Input.Keyboard.Key;
    space?: Phaser.Input.Keyboard.Key;
    shift?: Phaser.Input.Keyboard.Key;
};
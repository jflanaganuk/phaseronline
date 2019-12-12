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
    swing: boolean;
    pickup: boolean;
    inventory: boolean;
};

export type InventoryType = {
    itemType: string;
    amount: number;
    item_name?: string;
}

export type EquipmentType = {
    main: ItemDatabaseEntry | false;
    ranged: ItemDatabaseEntry | false;
    ammo: ItemDatabaseEntry | false;
}

export type PlayerType = {
    x: number;
    y: number;
    playerId: string;
    input: InputType;
    rolling: boolean;
    canRoll: boolean;
    swinging: boolean;
    canSwing: boolean;
    inventory: InventoryType[];
    inventoryTick: boolean;
    inventoryOpened: boolean;
    equipment: EquipmentType;
    destroy?(): void;
    setPosition?(x: number, y: number): void;
    body?: Phaser.Physics.Arcade.Body;
    direction?: Direction;
    anims?: {
        play(key: string, child: boolean): void;
    };
}

export type ItemPayload = {
    kind: 'main' | 'ranged' | 'ammo';
    type: string;
    amount: number | false;
} 

export type PlayersType = {
    [key: string]: PlayerType
}

export type EnemyType = {
    type: string;
    x: number;
    y: number;
    enemyId: string;
    direction: Direction;
    damage: number;
    speed: number;
    health: number;
    maxHealth: number;
    drops: {item: string; chance: number}[];
    beenHit: boolean;
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

export type SwordType = {
    x: number;
    y: number;
    playerId: string;
    direction: Direction;
    setPosition?(x: number, y: number): void;
    destroy?(): void;
}

export type SwordsType = {
    [key: string]: SwordType;
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

export type ItemDatabaseEntry = {
    item_name: string;
    readable_name: string;
    description: string;
    damage: number;
    speed: number;
    stackable: boolean;
    equip_type: "main" | "ranged" | "ammo";
}

export type SceneWithPlayersType = Phaser.Scene & {
    players: any;
    enemies: any;
    enemiesHealthBars: any;
    items: any;
    swords: any;
    socket?: any;
}

export type SceneWithPlayersAndInputType = SceneWithPlayersType & {
    cursors: CustomCursorKeys;
    mouse: Phaser.Input.Pointer;
    virtualKeys: {
        shift: {
            isDown: boolean;
        },
        pickup: {
            isDown: boolean;
        },
        inventory: {
            isDown: boolean;
        },
        swing: {
            isDown: boolean;
        },
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
    pickupKeyPressed: boolean;
    inventoryKeyPressed: boolean;
    swingKeyPressed: boolean;
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

export type EnemyHealthBarType = (Phaser.GameObjects.Rectangle) & {
    enemyId?: string;
}

export type ItemImageType = (Phaser.Physics.Arcade.Image | Phaser.GameObjects.Image) & {
    itemId?: string;
}

export type SwordImageType = (Phaser.Physics.Arcade.Image | Phaser.GameObjects.Image) & {
    playerId?: string;
    direction?: string;
}

export type CustomCursorKeys = {
    up?: Phaser.Input.Keyboard.Key;
    down?: Phaser.Input.Keyboard.Key;
    left?: Phaser.Input.Keyboard.Key;
    right?: Phaser.Input.Keyboard.Key;
    space?: Phaser.Input.Keyboard.Key;
    shift?: Phaser.Input.Keyboard.Key;
    pickup?: Phaser.Input.Keyboard.Key;
    inventory?: Phaser.Input.Keyboard.Key;
    swing?: Phaser.Input.Keyboard.Key;
};
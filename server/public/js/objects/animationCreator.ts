
export function createAnimations(anims: Phaser.Animations.AnimationManager) {
    animWrapper(anims, 'moveUp', 'playerMoveUp', 3);
    animWrapper(anims, 'moveLeft', 'playerMoveLeft', 3);
    animWrapper(anims, 'moveRight', 'playerMoveRight', 3);
    animWrapper(anims, 'moveDown', 'playerMoveDown', 3);
    animWrapper(anims, 'moveUpRight', 'playerMoveUpRight', 3);
    animWrapper(anims, 'moveUpLeft', 'playerMoveUpLeft', 3);
    animWrapper(anims, 'moveDownRight', 'playerMoveDownRight', 3);
    animWrapper(anims, 'moveDownLeft', 'playerMoveDownLeft', 3);

    animWrapper(anims, 'rollUp', 'playerRollUp', 3);
    animWrapper(anims, 'rollLeft', 'playerRollLeft', 3);
    animWrapper(anims, 'rollRight', 'playerRollRight', 3);
    animWrapper(anims, 'rollDown', 'playerRollDown', 3);
    animWrapper(anims, 'rollUpRight', 'playerRollUpRight', 3);
    animWrapper(anims, 'rollUpLeft', 'playerRollUpLeft', 3);
    animWrapper(anims, 'rollDownRight', 'playerRollDownRight', 3);
    animWrapper(anims, 'rollDownLeft', 'playerRollDownLeft', 3);

    animWrapper(anims, 'idleLeft', 'playerMoveLeft');
    animWrapper(anims, 'idleRight', 'playerMoveRight');
    animWrapper(anims, 'idleUp', 'playerMoveUp');
    animWrapper(anims, 'idleDown', 'playerMoveDown');
    animWrapper(anims, 'idleDownLeft', 'playerMoveDownLeft');
    animWrapper(anims, 'idleDownRight', 'playerMoveDownRight');
    animWrapper(anims, 'idleUpLeft', 'playerMoveUpLeft');
    animWrapper(anims, 'idleUpRight', 'playerMoveUpRight');

    animWrapper(anims, 'spawnLightning', 'spawnEffect', 21, 24, 0);
}

function animWrapper(anims: Phaser.Animations.AnimationManager, key: string, name: string, length: number = 0, frameRate: number = 10, repeat: number = -1) {
    anims.create({
        key,
        frames: anims.generateFrameNumbers(name, {start: 0, end: length}),
        frameRate,
        repeat
    });
}
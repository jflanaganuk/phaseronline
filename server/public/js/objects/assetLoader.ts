
export function assetLoader(context: Phaser.Scene){
    context.load.spritesheet('player', '../assets/player.png', { frameWidth: 16, frameHeight: 16});
    context.load.spritesheet('playerMoveDown', '../assets/TopDownCharacter/Character/Character_Down.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerMoveLeft', '../assets/TopDownCharacter/Character/Character_Left.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerMoveRight', '../assets/TopDownCharacter/Character/Character_Right.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerMoveUp', '../assets/TopDownCharacter/Character/Character_Up.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerMoveDownLeft', '../assets/TopDownCharacter/Character/Character_DownLeft.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerMoveDownRight', '../assets/TopDownCharacter/Character/Character_DownRight.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerMoveUpLeft', '../assets/TopDownCharacter/Character/Character_UpLeft.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerMoveUpRight', '../assets/TopDownCharacter/Character/Character_UpRight.png', {frameWidth: 32, frameHeight: 32});

    context.load.spritesheet('spawnEffect', '../assets/boltsequence.png', {frameWidth: 80, frameHeight: 80});

    context.load.spritesheet('playerRollRight', '../assets/TopDownCharacter/Character/Character_RollRight.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerRollLeft', '../assets/TopDownCharacter/Character/Character_RollLeft.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerRollUp', '../assets/TopDownCharacter/Character/Character_RollUp.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerRollDown', '../assets/TopDownCharacter/Character/Character_RollDown.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerRollUpRight', '../assets/TopDownCharacter/Character/Character_RollUpRight.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerRollUpLeft', '../assets/TopDownCharacter/Character/Character_RollUpLeft.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerRollDownRight', '../assets/TopDownCharacter/Character/Character_RollDownRight.png', {frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerRollDownLeft', '../assets/TopDownCharacter/Character/Character_RollDownLeft.png', {frameWidth: 32, frameHeight: 32});

    context.load.spritesheet('playerSwipeUp', '../assets/TopDownCharacter/Character/Character_SlashUpRight.png', { frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerSwipeLeft', '../assets/TopDownCharacter/Character/Character_SlashUpLeft.png', { frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerSwipeDown', '../assets/TopDownCharacter/Character/Character_SlashDownLeft.png', { frameWidth: 32, frameHeight: 32});
    context.load.spritesheet('playerSwipeRight', '../assets/TopDownCharacter/Character/Character_SlashDownRight.png', { frameWidth: 32, frameHeight: 32});

    context.load.spritesheet('enemySlimeMove', '../assets/maytchPack/spr_blob.png', { frameWidth: 16, frameHeight: 16});

    context.load.image('sword', '../assets/sword.png');
    context.load.image('bow', '../assets/bow.png');
    context.load.image('arrow', '../assets/arrow.png');

    context.load.image('button', '../assets/button.png');

    context.load.image("tiles", "../assets/entities-extruded.png");
    context.load.image("fullscreen", "../assets/fullscreen.png");
    context.load.tilemapTiledJSON("map", "../assets/leveldata/start.json");
    context.load.plugin('rexvirtualjoystickplugin', './public/js/virtualjoystick.min.js', true);
};
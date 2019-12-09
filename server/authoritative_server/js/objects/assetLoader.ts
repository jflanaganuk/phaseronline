

export function assetLoader(context: Phaser.Scene){
    context.load.spritesheet('player', '../assets/TopDownCharacter/Character/Character_Right.png', {
        frameWidth: 16,
        frameHeight: 16
    })
    context.load.spritesheet('enemy', '../assets/player.png', {
        frameWidth: 16,
        frameHeight: 16,
    });
    context.load.spritesheet('item', '../assets/sword.png', {
        frameWidth: 16,
        frameHeight: 16,
    });
    context.load.spritesheet('swordHitbox', '../assets/TopDownCharacter/Weapon/Sword_Hitbox.png', {
        frameWidth: 16,
        frameHeight: 16,
    });
    context.load.image("tiles", "../assets/entities.png");
    context.load.tilemapTiledJSON("map", "../assets/leveldata/start.json");
}
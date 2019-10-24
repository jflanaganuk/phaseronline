import { SceneWithPlayersAndInputType, EnemyType, EnemyImageType, EnemiesType } from "../../../shared/types";

export function onEnemyUpdate(enemies: EnemiesType, context: SceneWithPlayersAndInputType) {
    Object.keys(enemies).forEach(function(id) {
        context.enemies.getChildren().forEach(function (enemy: EnemyType) {
            const { x, y, enemyId } = enemies[id];
            if (enemyId === enemy.enemyId && enemy.anims) {
                enemy.setPosition && enemy.setPosition(x, y);
                enemy.anims && enemy.anims.play('enemyMoveIdle', true);
            }
        });
    });
}

export function displayEnemies(self: SceneWithPlayersAndInputType, enemyInfo: EnemyType, sprite: string) {
    const enemy: EnemyImageType = self.add.sprite(enemyInfo.x, enemyInfo.y, sprite).setScale(2);
    enemy.enemyId = enemyInfo.enemyId;
    self.enemies.add(enemy);
} 

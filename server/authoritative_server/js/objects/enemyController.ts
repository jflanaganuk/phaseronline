import { SceneWithPlayersType, EnemyType, EnemyImageType, EnemiesType } from "../../../shared/types";

export function addEnemy(self: SceneWithPlayersType, enemyInfo: EnemyType) {
    const enemy: EnemyImageType = self.physics.add.image(enemyInfo.x, enemyInfo.y, 'enemy').setScale(2);
    enemy.enemyId = enemyInfo.enemyId;
    self.enemies.add(enemy);
}

export function removeEnemy(self: SceneWithPlayersType, enemyId: string) {
    self.enemies.getChildren().forEach((enemy: EnemyType) => {
        if (enemyId === enemy.enemyId) {
            enemy.destroy && enemy.destroy();
        }
    });
}

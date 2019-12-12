import { SceneWithPlayersAndInputType, EnemyType, EnemyImageType, EnemiesType, EnemyHealthBarType } from "../../../shared/types";

export function onEnemyUpdate(enemies: EnemiesType, context: SceneWithPlayersAndInputType) {
    Object.keys(enemies).forEach(function(id) {
        context.enemies.getChildren().forEach(function (enemy: EnemyType) {
            const { x, y, enemyId, health, maxHealth } = enemies[id];
            if (enemyId === enemy.enemyId && enemy.anims) {
                enemy.setPosition && enemy.setPosition(x, y);
                enemy.anims && enemy.anims.play('enemyMoveIdle', true);
                context.enemiesHealthBars.getChildren().forEach(function (enemyHealthBar: EnemyHealthBarType) {
                    if (enemyId === enemyHealthBar.enemyId) {
                        enemyHealthBar.setPosition(x, y - 12);
                        const healthRatio = Math.ceil(health/maxHealth * 10);
                        enemyHealthBar.setSize(healthRatio * 3, 5);
                        if (healthRatio <= 5) {
                            enemyHealthBar.setFillStyle(0xCCCC00);
                        }
                        if (healthRatio <= 2) {
                            enemyHealthBar.setFillStyle(0xCC0000);
                        }
                    }
                });
            }
        });
    });
}

export function displayEnemies(self: SceneWithPlayersAndInputType, enemyInfo: EnemyType, sprite: string) {
    const enemy: EnemyImageType = self.add.sprite(enemyInfo.x, enemyInfo.y, sprite).setScale(2);
    const health: EnemyHealthBarType = self.add.rectangle(enemyInfo.x, enemyInfo.y - 12, 30, 5, 0x00CC00);
    enemy.enemyId = enemyInfo.enemyId;
    health.enemyId = enemyInfo.enemyId;
    self.enemies.add(enemy);
    self.enemiesHealthBars.add(health);
} 

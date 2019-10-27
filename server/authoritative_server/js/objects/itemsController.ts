import { SceneWithPlayersType, ItemType, ItemImageType } from "../../../shared/types";

export function addItem(self: SceneWithPlayersType, itemInfo: ItemType) {
    const item: ItemImageType = self.physics.add.image(itemInfo.x, itemInfo.y, 'item').setScale(2);
    item.itemId = itemInfo.itemId;
    item.type = itemInfo.type;
    self.items.add(item);
}

export function removeItem(self: SceneWithPlayersType, itemId: string) {
    self.items.getChildren().forEach((item: ItemType) => {
        if (itemId === item.itemId) {
            item.destroy && item.destroy();
        }
    });
}

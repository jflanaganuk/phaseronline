import { SceneWithPlayersAndInputType, ItemType, ItemImageType } from "../../../shared/types";

export function displayItem(self: SceneWithPlayersAndInputType, itemInfo: ItemType) {
    const item: ItemImageType = self.add.sprite(itemInfo.x, itemInfo.y, itemInfo.type).setScale(2);
    item.itemId = itemInfo.itemId;
    item.type = itemInfo.type;
    self.items.add(item);
}

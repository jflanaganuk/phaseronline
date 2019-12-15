import { SceneWithPlayersAndInputType, NpcType, NpcImageType } from "../../../shared/types";


export function displayNpc(self: SceneWithPlayersAndInputType, npcInfo: NpcType) {
    const npc: NpcImageType = self.add.sprite(npcInfo.x, npcInfo.y, npcInfo.type).setScale(2);
    npc.type = npcInfo.type;
    self.npcs.add(npc);
}

import { SceneWithPlayersType, NpcType, NpcImageType } from "../../../shared/types";

export function addNpc(self: SceneWithPlayersType, npcInfo: NpcType) {
    const npc: NpcImageType = self.physics.add.image(npcInfo.x, npcInfo.y, 'npc').setScale(2);
    npc.type = npcInfo.type;
    self.npcs.add(npc);
}

import { _decorator, Component, SpriteFrame } from 'cc'
const { ccclass, property } = _decorator

import { TileManager } from 'db://assets/Scripts/Scene/Tile/TileManager'
import { createUINode, randomByRange } from 'db://assets/Utils'
import DateManager from 'db://assets/Runtime/DateManager'
import ResourceManager from 'db://assets/Runtime/ResourceManager'

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const spriteFrames = await ResourceManager.Instance.loadDir('texture/tile/tile', SpriteFrame)
    const { mapInfo } = DateManager.Instance
    DateManager.Instance.tileInfo = []

    console.log(spriteFrames)

    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      DateManager.Instance.tileInfo[i] = []
      for (let j = 0; j < column.length; j++) {
        const item = column[j]
        if (item.src === null || item.type === null) {
          continue
        }

        let number = item.src
        if ((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
          number += randomByRange(0, 4)
        }

        const imgSrc = `tile (${number})`
        const node = createUINode()
        const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]

        const tileManager = node.addComponent(TileManager)
        const type = item.type
        tileManager.init(type, spriteFrame, i, j)
        DateManager.Instance.tileInfo[i][j] = tileManager

        node.setParent(this.node)
      }
    }
  }
}

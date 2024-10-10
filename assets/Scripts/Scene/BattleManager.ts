import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Scripts/Scene/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import DateManager from 'db://assets/Runtime/DateManager'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Scene/Tile/TileManager'
import EventManager from 'db://assets/Runtime/EventManager'
import { EVENT_ENUM } from 'db://assets/Enums'
import { PlayerManager } from 'db://assets/Scripts/Player/PlayerManager'
const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel
  stage: Node

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }
  start() {
    this.generateStage()
    this.initLevel()
  }

  initLevel() {
    const level = Levels[`level${DateManager.Instance.levelIndex}`]
    if (level) {
      this.cleanLevel()
      this.level = level
      DateManager.Instance.mapInfo = this.level.mapInfo
      DateManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DateManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

      this.generateTileMap()
      this.generatePlayer()
    }
  }

  nextLevel() {
    DateManager.Instance.levelIndex++
    this.initLevel()
  }

  cleanLevel() {
    this.stage.destroyAllChildren()
    DateManager.Instance.reset()
  }

  generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  generateTileMap() {
    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileManager = tileMap.addComponent(TileMapManager)
    tileManager.init()
    this.adaptPos()
  }

  generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }
  adaptPos() {
    const { mapRowCount, mapColumnCount } = DateManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80
    this.stage.setPosition(-disX, disY)
  }
}

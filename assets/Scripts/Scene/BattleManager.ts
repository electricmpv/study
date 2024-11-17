import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Scripts/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import DateManager from 'db://assets/Runtime/DateManager'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import EventManager from 'db://assets/Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { PlayerManager } from 'db://assets/Scripts/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Scripts/WoodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from 'db://assets/Scripts/Door/DoorManager'
import { IronSkeletonManager } from 'db://assets/Scripts/IronSkeleton/IronSkeletonManager'
import { BurstManager } from 'db://assets/Scripts/Burst/BurstManager'
import { SpikesManager } from 'db://assets/Scripts/Spikes/SpikesManager'
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
      //this.generateBursts()
      this.generateSpikes()
      this.generateDoor()
      this.generatePlayer()
      this.generateEnemies()
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

  async generateTileMap() {
    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileManager = tileMap.addComponent(TileMapManager)
    await tileManager.init()
    this.adaptPos()
  }

  async generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    await playerManager.init({
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  async generateEnemies() {
    const enemy1 = createUINode()
    enemy1.setParent(this.stage)
    const woodenSkeletonManager = enemy1.addComponent(WoodenSkeletonManager)
    await woodenSkeletonManager.init({
      x: 2,
      y: 4,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.enemies.push(woodenSkeletonManager)

    const enemy2 = createUINode()
    enemy2.setParent(this.stage)
    const ironSkeletonManager = enemy2.addComponent(IronSkeletonManager)
    await ironSkeletonManager.init({
      x: 2,
      y: 2,
      type: ENTITY_TYPE_ENUM.SKELETON_IRON,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.enemies.push(ironSkeletonManager)
  }

  async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init({
      x: 7,
      y: 8,
      type: ENTITY_TYPE_ENUM.DOOR,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.door = doorManager
  }

  async generateBursts() {
    const burst = createUINode()
    burst.setParent(this.stage)
    const burstManager = burst.addComponent(BurstManager)
    await burstManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.BURST,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.bursts.push(burstManager)
  }

  async generateSpikes() {
    const spikes = createUINode()
    spikes.setParent(this.stage)
    const spikesManager = spikes.addComponent(SpikesManager)
    await spikesManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.SPIKES_FOUR,
      count: 0,
    })
    DateManager.Instance.spikes.push(spikesManager)
  }
  adaptPos() {
    const { mapRowCount, mapColumnCount } = DateManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80
    this.stage.setPosition(-disX, disY)
  }
}

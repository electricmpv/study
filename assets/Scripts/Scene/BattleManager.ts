import { _decorator, Component, Node, director } from 'cc'
import { TileMapManager } from 'db://assets/Scripts/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import DateManager, { IRecord } from 'db://assets/Runtime/DateManager'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import EventManager from 'db://assets/Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from 'db://assets/Enums'
import { PlayerManager } from 'db://assets/Scripts/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Scripts/WoodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from 'db://assets/Scripts/Door/DoorManager'
import { IronSkeletonManager } from 'db://assets/Scripts/IronSkeleton/IronSkeletonManager'
import { BurstManager } from 'db://assets/Scripts/Burst/BurstManager'
import { SpikesManager } from 'db://assets/Scripts/Spikes/SpikesManager'
import { SmokeManager } from 'db://assets/Scripts/Smoke/SmokeManager'
import FaderManager from 'db://assets/Runtime/FaderManager'
import { ShakeManager } from 'db://assets/Scripts/UI/ShakeManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  /*level: ILevel
  stage: Node*/
  private level: ILevel
  private stage: Node = null
  private smokeLayer: Node = null
  private inited = false

  onLoad() {
    DateManager.Instance.levelIndex = 1
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
    EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
    EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
    EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this)
    EventManager.Instance.on(EVENT_ENUM.OUT_BATTLE, this.outBattle, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
    EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
    EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record)
    EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
    EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL, this.initLevel)
    EventManager.Instance.off(EVENT_ENUM.OUT_BATTLE, this.outBattle)
  }
  start() {
    this.generateStage()
    this.initLevel()
  }

  async initLevel() {
    const level = Levels[`level${DateManager.Instance.levelIndex}`]
    if (level) {
      if (this.inited) {
        await FaderManager.Instance.fadeIn()
      } else {
        await FaderManager.Instance.mask()
      }

      this.cleanLevel()
      this.level = level
      DateManager.Instance.mapInfo = this.level.mapInfo
      DateManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DateManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

      await Promise.all([
        this.generateTileMap(),
        this.generateBursts(),
        this.generateSpikes(),
        this.generateSmokeLayer(),
        this.generateDoor(),
        this.generatePlayer(),
        this.generateEnemies(),
      ])

      await FaderManager.Instance.fadeOut()
      this.inited = true
    } else {
      this.outBattle()
    }
  }

  async outBattle() {
    await FaderManager.Instance.fadeIn()
    director.loadScene(SCENE_ENUM.Start)
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
    this.stage.addComponent(ShakeManager)
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
    await playerManager.init(this.level.player)
    DateManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  async generateEnemies() {
    const promise = []
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const manager = node.addComponent(Manager)
      promise.push(manager.init(enemy))
      DateManager.Instance.enemies.push(manager)
    }
    await Promise.all(promise)
    /*const enemy1 = createUINode()
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
    DateManager.Instance.enemies.push(ironSkeletonManager)*/
  }

  async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DateManager.Instance.door = doorManager
  }

  async generateBursts() {
    const promise = []
    for (let i = 0; i < this.level.bursts.length; i++) {
      const burst = this.level.bursts[i]
      const node = createUINode()
      node.setParent(this.stage)

      const burstManager = node.addComponent(BurstManager)
      promise.push(burstManager.init(burst))
      DateManager.Instance.bursts.push(burstManager)
    }
    await Promise.all(promise)

    /*const burst = createUINode()
    burst.setParent(this.stage)
    const burstManager = burst.addComponent(BurstManager)
    await burstManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.BURST,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.bursts.push(burstManager)*/
  }

  async generateSpikes() {
    const promise = []
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spikes = this.level.spikes[i]
      const node = createUINode()
      node.setParent(this.stage)

      const spikesManager = node.addComponent(SpikesManager)
      promise.push(spikesManager.init(spikes))
      DateManager.Instance.spikes.push(spikesManager)
    }
    await Promise.all(promise)
    /*const spikes = createUINode()
    spikes.setParent(this.stage)
    const spikesManager = spikes.addComponent(SpikesManager)
    await spikesManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.SPIKES_FOUR,
      count: 0,
    })
    DateManager.Instance.spikes.push(spikesManager)*/
  }

  async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    const item = DateManager.Instance.smokes.find((smoke: SmokeManager) => smoke.state === ENTITY_STATE_ENUM.DEATH)
    if (item) {
      console.log('复用')
      item.x = x
      item.y = y
      item.node.setPosition(item.x * TILE_WIDTH - TILE_WIDTH * 1.5, -item.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
      item.direction = direction
      item.state = ENTITY_STATE_ENUM.IDLE
    } else {
      const node = createUINode()
      node.setParent(this.smokeLayer)
      const smokeManager = node.addComponent(SmokeManager)
      await smokeManager.init({
        x,
        y,
        direction,
        state: ENTITY_STATE_ENUM.IDLE,
        type: ENTITY_TYPE_ENUM.SMOKE,
      })
      DateManager.Instance.smokes.push(smokeManager)
    }
  }

  async generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }

  checkArrived() {
    if (!DateManager.Instance.player || !DateManager.Instance.door) return
    const { x: playerX, y: playerY } = DateManager.Instance.player
    const { x: doorX, y: doorY, state: doorState } = DateManager.Instance.door
    if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }
  adaptPos() {
    const { mapRowCount, mapColumnCount } = DateManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80
    this.stage.getComponent(ShakeManager).shop()
    this.stage.setPosition(-disX, disY)
  }

  record() {
    const item: IRecord = {
      player: {
        x: DateManager.Instance.player.x,
        y: DateManager.Instance.player.y,
        direction: DateManager.Instance.player.direction,
        state:
          DateManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE ||
          DateManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH ||
          DateManager.Instance.player.state === ENTITY_STATE_ENUM.AIRDEATH
            ? DateManager.Instance.player.state
            : ENTITY_STATE_ENUM.IDLE,
        type: DateManager.Instance.player.type,
      },

      door: {
        x: DateManager.Instance.door.x,
        y: DateManager.Instance.door.y,
        direction: DateManager.Instance.door.direction,
        state: DateManager.Instance.door.state,
        type: DateManager.Instance.door.type,
      },
      enemies: DateManager.Instance.enemies.map(({ x, y, direction, state, type }) => ({
        x,
        y,
        direction,
        state,
        type,
      })),
      bursts: DateManager.Instance.bursts.map(({ x, y, direction, state, type }) => ({ x, y, direction, state, type })),
      spikes: DateManager.Instance.spikes.map(({ x, y, count, type }) => ({ x, y, count, type })),
    }
    DateManager.Instance.records.push(item)
  }

  revoke() {
    const item = DateManager.Instance.records.pop()
    if (!item) return
    if (item) {
      DateManager.Instance.player.x = DateManager.Instance.player.targetX = item.player.x
      DateManager.Instance.player.y = DateManager.Instance.player.targetY = item.player.y
      DateManager.Instance.player.direction = item.player.direction
      DateManager.Instance.player.state = item.player.state

      DateManager.Instance.door.x = item.door.x
      DateManager.Instance.door.y = item.door.y
      DateManager.Instance.door.direction = item.door.direction
      DateManager.Instance.door.state = item.door.state

      for (let i = 0; i < DateManager.Instance.enemies.length; i++) {
        DateManager.Instance.enemies[i].x = item.enemies[i].x
        DateManager.Instance.enemies[i].y = item.enemies[i].y
        DateManager.Instance.enemies[i].direction = item.enemies[i].direction
        DateManager.Instance.enemies[i].state = item.enemies[i].state
      }

      for (let i = 0; i < DateManager.Instance.bursts.length; i++) {
        DateManager.Instance.bursts[i].x = item.bursts[i].x
        DateManager.Instance.bursts[i].y = item.bursts[i].y
        DateManager.Instance.bursts[i].direction = item.bursts[i].direction
        DateManager.Instance.bursts[i].state = item.bursts[i].state
      }

      for (let i = 0; i < DateManager.Instance.spikes.length; i++) {
        DateManager.Instance.spikes[i].x = item.spikes[i].x
        DateManager.Instance.spikes[i].y = item.spikes[i].y
        DateManager.Instance.spikes[i].count = item.spikes[i].count
      }
    }
  }
}

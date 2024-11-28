import { ILevel, ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'
import { TileManager } from 'db://assets/Scripts/Tile/TileManager'
import { PlayerManager } from 'db://assets/Scripts/Player/PlayerManager'

import { DoorManager } from 'db://assets/Scripts/Door/DoorManager'
import { EnemyManager } from 'db://assets/Base/EnemyManager'
import { BurstManager } from 'db://assets/Scripts/Burst/BurstManager'
import { SpikesManager } from 'db://assets/Scripts/Spikes/SpikesManager'
import { SmokeManager } from 'db://assets/Scripts/Smoke/SmokeManager'

export type IRecord = Omit<ILevel, 'mapInfo'>

export default class DateManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DateManager>()
  }

  mapInfo: Array<Array<ITile>>
  tileInfo: Array<Array<TileManager>>
  mapRowCount: number = 0
  mapColumnCount: number = 0
  levelIndex: number = 1
  player: PlayerManager
  door: DoorManager
  enemies: EnemyManager[]
  bursts: BurstManager[]
  spikes: SpikesManager[]
  smokes: SmokeManager[]
  records: IRecord[]

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.player = null
    this.door = null
    this.enemies = []
    this.bursts = []
    this.spikes = []
    this.smokes = []
    this.records = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }
}

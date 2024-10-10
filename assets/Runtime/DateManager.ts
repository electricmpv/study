import { ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'
import { TileManager } from 'db://assets/Scripts/Scene/Tile/TileManager'

export default class DateManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DateManager>()
  }

  mapInfo: Array<Array<ITile>>
  tileInfo: Array<Array<TileManager>>
  mapRowCount: number = 0
  mapColumnCount: number = 0
  levelIndex: number = 1

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }
}

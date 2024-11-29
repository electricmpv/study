import level1 from 'db://assets/Levels/level1'

import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from 'db://assets/Enums'
import level2 from 'db://assets/Levels/level2'
import level21 from 'db://assets/Levels/level21'
import level3 from 'db://assets/Levels/level3'
import level4 from 'db://assets/Levels/level4'
import level5 from 'db://assets/Levels/level5'
import level6 from 'db://assets/Levels/level6'
import level7 from 'db://assets/Levels/level7'
import level8 from 'db://assets/Levels/level8'
import level9 from 'db://assets/Levels/level9'
import level10 from 'db://assets/Levels/level10'
import level11 from 'db://assets/Levels/level11'
import level12 from 'db://assets/Levels/level12'
import level13 from 'db://assets/Levels/level13'
import level14 from 'db://assets/Levels/level14'
import level15 from 'db://assets/Levels/level15'
import level16 from 'db://assets/Levels/level16'
import level17 from 'db://assets/Levels/level17'
import level18 from 'db://assets/Levels/level18'
import level19 from 'db://assets/Levels/level19'
import level20 from 'db://assets/Levels/level20'

export interface IEntity {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  direction: DIRECTION_ENUM
  state: ENTITY_STATE_ENUM
}

export interface ISpikes {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  count: number
}

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
  player: IEntity
  enemies: Array<IEntity>
  spikes: Array<ISpikes>
  bursts: Array<IEntity>
  door: IEntity
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
  level17,
  level18,
  level19,
  level20,
  level21,
}

export default levels

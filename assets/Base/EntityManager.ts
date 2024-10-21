import { _decorator, Component, Sprite, UITransform } from 'cc'

import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'

import {
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  PARAMS_NAME_ENUM,
} from 'db://assets/Enums'

import { PlayerStateMachine } from 'db://assets/Scripts/Player/PlayerStateMachine'
import { IEntity } from 'db://assets/Levels'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { randomByLen } from 'db://assets/Utils'

const { ccclass, property } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  id: string = randomByLen(12)
  x: number = 0
  y: number = 0

  fsm: StateMachine

  private _direction: DIRECTION_ENUM
  private _state: ENTITY_STATE_ENUM
  private type: ENTITY_TYPE_ENUM

  get direction() {
    return this._direction
  }

  set direction(newDirection) {
    this._direction = newDirection
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  get state() {
    return this._state
  }

  set state(newState) {
    this._state = newState
    this.fsm.setParams(newState, true)
  }

  async init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.direction = params.direction
    this.state = params.state
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onDestroy() {}
}

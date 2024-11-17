import { _decorator } from 'cc'

import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'

import { EntityManager } from 'db://assets/Base/EntityManager'

import EventManager from 'db://assets/Runtime/EventManager'
import { DoorStateMachine } from 'db://assets/Scripts/Door/DoorStateMachine'
import DateManager from 'db://assets/Runtime/DateManager'
import { IEntity } from 'db://assets/Levels'

const { ccclass, property } = _decorator

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(DoorStateMachine)
    await this.fsm.init()

    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen)
  }

  onOpen() {
    if (
      DateManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH) &&
      this.state !== ENTITY_STATE_ENUM.DEATH
    ) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}

import { _decorator } from 'cc'

import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'

import { EntityManager } from 'db://assets/Base/EntityManager'
import DateManager from 'db://assets/Runtime/DateManager'
import { WoodenSkeletonStateMachine } from 'db://assets/Scripts/WoodenSkeleton/WoodenSkeletonStateMachine'
import EventManager from 'db://assets/Runtime/EventManager'
import { EnemyManager } from 'db://assets/Base/EnemyManager'
import { IEntity } from 'db://assets/Levels'

const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  onDestroy() {
    super.onDestroy()

    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
  }

  onAttack() {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DateManager.Instance.player) return
    const { x: playerX, y: playerY, state: playerState } = DateManager.Instance.player
    if (
      (this.x === playerX && Math.abs(this.y - playerY) <= 1) ||
      (this.y === playerY &&
        Math.abs(this.x - playerX) <= 1 &&
        playerState !== ENTITY_STATE_ENUM.DEATH &&
        playerState !== ENTITY_STATE_ENUM.AIRDEATH)
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}

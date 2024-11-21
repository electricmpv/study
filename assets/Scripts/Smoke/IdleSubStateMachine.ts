import { SubStateMachine } from 'db://assets/Base/SubStateMachine'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'
import State, { ANIMATION_SPEED } from 'db://assets/Base/State'
import { AnimationClip } from 'cc'
import DirectionSubStateMachine from 'db://assets/Base/DirectionSubStateMachine'

const BASE_URL = 'texture/smoke/idle'
export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(
      DIRECTION_ENUM.TOP,
      new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.BOTTOM,
      new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
    )
  }
}

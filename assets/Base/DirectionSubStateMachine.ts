import { SubStateMachine } from 'db://assets/Base/SubStateMachine'

import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'

/*
export default class DirectionSubStateMachine extends SubStateMachine {
  run() {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
*/
export default abstract class DirectionSubStateMachine extends SubStateMachine {
  run() {
    const { value: newDirection } = this.fsm.params.get(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[newDirection as number])
  }
}

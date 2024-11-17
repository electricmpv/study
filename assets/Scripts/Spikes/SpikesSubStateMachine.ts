import { StateMachine } from 'db://assets/Base/StateMachine'
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from 'db://assets/Enums'
import State from 'db://assets/Base/State'

import { SubStateMachine } from 'db://assets/Base/SubStateMachine'

export default class SpikesSubStateMachine extends SubStateMachine {
  run() {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number])
  }
}

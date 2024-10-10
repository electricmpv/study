import { _decorator } from 'cc'

import State from 'db://assets/Base/State'
import { StateMachine } from 'db://assets/Base/StateMachine'

const { ccclass, property } = _decorator

export abstract class SubStateMachine {
  private _currentState: State = null

  stateMachines: Map<string, State> = new Map()

  constructor(public fsm: StateMachine) {}
  get currentState() {
    return this._currentState
  }

  set currentState(newState) {
    this._currentState = newState
    this._currentState.run()
  }

  abstract run(): void
}

import { _decorator } from 'cc'

import { IEntity } from 'db://assets/Levels'

import { EntityManager } from 'db://assets/Base/EntityManager'

import { SmokeStateMachine } from 'db://assets/Scripts/Smoke/SmokeStateMachine'

const { ccclass, property } = _decorator

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()

    super.init(params)
  }
}

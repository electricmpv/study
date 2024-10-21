import { _decorator } from 'cc'

import { EnemyManager } from 'db://assets/Base/EnemyManager'
import { IEntity } from 'db://assets/Levels'
import { IronSkeletonStateMachine } from 'db://assets/Scripts/IronSkeleton/IronSkeletonStateMachine'

const { ccclass, property } = _decorator

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)
  }
}

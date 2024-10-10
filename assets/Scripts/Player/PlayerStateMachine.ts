import { _decorator, Animation } from 'cc'
import { PARAMS_NAME_ENUM } from 'db://assets/Enums'

import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from 'db://assets/Base/StateMachine'
import IdleSubStateMachine from 'db://assets/Scripts/Player/IdleSubStateMachine'
import TurnLeftSubStateMachine from 'db://assets/Scripts/Player/TurnLeftSubStateMachine'

const { ccclass, property } = _decorator

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()
    console.log('等待资源加载...')
    await Promise.all(this.waitingList)
    console.log('所有资源加载完成')
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn']
      if (whiteList.some(v => name.includes(v))) {
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}

/**run() {
    if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
      this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
    } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
      this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    } else {
      // 如果没有其他状态激活，默认回到 IDLE
      this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
   **/

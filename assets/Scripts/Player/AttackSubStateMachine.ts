import { StateMachine } from 'db://assets/Base/StateMachine'
import { DIRECTION_ENUM, SHAKE_TYPE_ENUM } from 'db://assets/Enums'
import State, { ANIMATION_SPEED } from 'db://assets/Base/State'
import DirectionSubStateMachine from 'db://assets/Base/DirectionSubStateMachine'
import { AnimationClip } from 'cc'

const BASE_URL = 'texture/player/attack'
export default class AttackSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(
      DIRECTION_ENUM.TOP,
      new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
        {
          frame: ANIMATION_SPEED * 4, // 第 5帧时触发事件
          func: 'onAttackShake', // 事件触发时调用的函数名称
          params: [SHAKE_TYPE_ENUM.TOP], // 向 `func` 传递的参数
        },
      ]),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.BOTTOM,
      new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
        {
          frame: ANIMATION_SPEED * 4, // 第 5帧时触发事件
          func: 'onAttackShake', // 事件触发时调用的函数名称
          params: [SHAKE_TYPE_ENUM.BOTTOM], // 向 `func` 传递的参数
        },
      ]),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
        {
          frame: ANIMATION_SPEED * 4, // 第 5帧时触发事件
          func: 'onAttackShake', // 事件触发时调用的函数名称
          params: [SHAKE_TYPE_ENUM.LEFT], // 向 `func` 传递的参数
        },
      ]),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
        {
          frame: ANIMATION_SPEED * 4, // 第 5帧时触发事件
          func: 'onAttackShake', // 事件触发时调用的函数名称
          params: [SHAKE_TYPE_ENUM.RIGHT], // 向 `func` 传递的参数
        },
      ]),
    )
  }
}

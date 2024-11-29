import { _decorator, Component, Node, Event, Graphics, view, Color, game, BlockInputEvents, UITransform } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from 'db://assets/Enums'
const { ccclass, property } = _decorator

export const SCREEN_WIDTH = view.getVisibleSize().width
export const SCREEN_HEIGHT = view.getVisibleSize().height

enum FADE_STATE_ENUM {
  IDLE = 'IDLE',
  FADE_IN = 'FADE_IN',
  FADE_OUT = 'FADE_OUT',
}

export const DEFAULT_DURATION = 200
@ccclass('DrawManager')
export class DrawManager extends Component {
  private ctx: Graphics
  private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
  private oldTime: number = 0
  private duration: number = 0
  private fadeResolver: (value: PromiseLike<null>) => void
  private block: BlockInputEvents
  init() {
    this.block = this.addComponent(BlockInputEvents)
    this.ctx = this.addComponent(Graphics)
    const transform = this.getComponent(UITransform)
    transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    transform.setAnchorPoint(0.5, 0.5)

    //this.node.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)
    // 获取当前屏幕的实际尺寸

    this.setAlpha(1)

    // 添加日志来检查大小
    console.log('Node Content Size:', transform.contentSize)
    if (this.node.parent) {
      const parentTransform = this.node.parent.getComponent(UITransform)
      if (parentTransform) {
        console.log('Parent Node Content Size:', parentTransform.contentSize)
      } else {
        console.warn('Parent Node does not have a UITransform component!')
      }
    } else {
      console.warn('Node has no parent!')
    }
  }

  setAlpha(percent: number) {
    this.ctx.clear()
    this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.ctx.fillColor = new Color(0, 0, 0, 255 * percent)
    this.ctx.fill()
    this.block.enabled = percent === 1
  }

  update() {
    const percent = (game.totalTime - this.oldTime) / this.duration

    switch (this.state) {
      case FADE_STATE_ENUM.FADE_IN:
        if (percent < 1) {
          this.setAlpha(percent)
        } else {
          this.setAlpha(1)
          this.state = FADE_STATE_ENUM.IDLE
          this.fadeResolver(null)
        }
        break
      case FADE_STATE_ENUM.FADE_OUT:
        if (percent < 1) {
          this.setAlpha(1 - percent)
        } else {
          this.setAlpha(0)
          this.state = FADE_STATE_ENUM.IDLE
          this.fadeResolver(null)
        }
        break
    }
  }

  fadeIn(duration = DEFAULT_DURATION) {
    this.setAlpha(0)
    this.duration = duration
    this.oldTime = game.totalTime
    this.state = FADE_STATE_ENUM.FADE_IN
    return new Promise(resolve => {
      this.fadeResolver = resolve
    })
  }

  fadeOut(duration = DEFAULT_DURATION) {
    this.setAlpha(1)
    this.duration = duration
    this.oldTime = game.totalTime
    this.state = FADE_STATE_ENUM.FADE_OUT
    return new Promise(resolve => {
      this.fadeResolver = resolve
    })
  }
  mask() {
    this.setAlpha(1)
    return new Promise(resolve => {
      setTimeout(resolve, DEFAULT_DURATION)
    })
  }
}

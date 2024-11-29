import { _decorator, Component, Node, Event, director } from 'cc'

import FaderManager from 'db://assets/Runtime/FaderManager'
import { SCENE_ENUM } from 'db://assets/Enums'
const { ccclass, property } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {
  onLoad() {
    director.preloadScene(SCENE_ENUM.Battle)
    FaderManager.Instance.fadeOut(1000)
    this.node.once(Node.EventType.TOUCH_END, this.handleStart, this)
  }

  async handleStart() {
    await FaderManager.Instance.fadeIn(300)
    director.loadScene(SCENE_ENUM.Battle)
  }
}

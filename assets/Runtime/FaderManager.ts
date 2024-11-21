import { game, RenderRoot2D, UITransform, view } from 'cc'
import Singleton from 'db://assets/Base/Singleton'
import { DEFAULT_DURATION, DrawManager, SCREEN_HEIGHT, SCREEN_WIDTH } from 'db://assets/Scripts/UI/DrawManager'
import { createUINode } from 'db://assets/Utils'

export default class FaderManager extends Singleton {
  static get Instance() {
    return super.GetInstance<FaderManager>()
  }

  private _fader: DrawManager = null

  get fader(): DrawManager {
    if (this._fader !== null) {
      return this._fader
    }

    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const node = createUINode()
    node.setParent(root)
    this._fader = node.addComponent(DrawManager)
    this._fader.init()
    game.addPersistRootNode(root)

    return this._fader
  }

  fadeIn(duration: number = DEFAULT_DURATION) {
    return this.fader.fadeIn(duration)
  }
  fadeOut(duration: number = DEFAULT_DURATION) {
    return this.fader.fadeOut(duration)
  }
}

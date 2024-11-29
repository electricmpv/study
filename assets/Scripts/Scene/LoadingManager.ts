import { _decorator, Component, Node, Event, director, resources, ProgressBar } from 'cc'

import { SCENE_ENUM } from 'db://assets/Enums'
const { ccclass, property } = _decorator

/*
@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null
  onLoad() {
    resources.preloadDir(
      'texture',
      (cur, total) => {
        this.bar.progress = cur / total
      },
      () => {
        director.loadScene(SCENE_ENUM.Start)
      },
    )
  }
}
*/
@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar

  onLoad() {
    this.preLoad() // 调用预加载方法
  }

  preLoad() {
    director.preloadScene(SCENE_ENUM.Start) // 预加载场景
    resources.preloadDir(
      'texture',
      (cur, total) => {
        this.bar.progress = cur / total // 更新进度条
      },
      async err => {
        if (err) {
          // 处理加载错误
          await new Promise(rs => {
            setTimeout(rs, 2000) // 等待 2 秒
          })
          this.preLoad() // 重试加载
          return
        }

        director.loadScene(SCENE_ENUM.Start) // 加载完成后切换场景
      },
    )
  }
}

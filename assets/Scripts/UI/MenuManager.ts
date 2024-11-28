import { _decorator, Component, Node, Event } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from 'db://assets/Enums'
const { ccclass, property } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleUndo() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }
}

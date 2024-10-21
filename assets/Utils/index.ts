import { Layers, Node, SpriteFrame, UITransform } from 'cc'
export const createUINode = (name: string = '') => {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  node.layer = 1 << Layers.nameToLayer('UI_2D')
  return node
}

export const randomByLen = (len: number) =>
  Array.from({ length: len }).reduce<string>((total, item) => total + Math.floor(Math.random() * 10), '')

export const randomByRange = (start: number, end: number) => {
  return Math.floor(start + (end - start) * Math.random())
}

const reg = /\((\d+)\)/

const getNumberWithinString = (str: string) => parseInt(str.match(reg)[1] || '0')
export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) =>
  spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))

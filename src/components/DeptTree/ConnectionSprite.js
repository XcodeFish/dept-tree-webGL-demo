import { Graphics } from 'pixi.js'

/**
 * 连线精灵类，用于绘制节点之间的连接
 */
export default class ConnectionSprite extends Graphics {
  /**
   * 创建一个新的连线精灵
   * @param {number} startX - 起始X坐标
   * @param {number} startY - 起始Y坐标
   * @param {number} endX - 结束X坐标
   * @param {number} endY - 结束Y坐标
   */
  constructor(startX, startY, endX, endY) {
    super()
    
    // 存储坐标
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    
    // 绘制连线
    this.draw()
  }
  
  /**
   * 绘制连线
   */
  draw() {
    // 设置线样式
    this.lineStyle(1, 0xcccccc)
    
    // 清除之前的绘制
    this.clear()
    
    // 垂直线段
    const midY = (this.startY + this.endY) / 2
    
    // 移动到起点
    this.moveTo(this.startX, this.startY)
    
    // 绘制到中点
    this.lineTo(this.startX, midY)
    
    // 绘制到终点的X坐标，但保持Y坐标不变
    this.lineTo(this.endX, midY)
    
    // 绘制到终点
    this.lineTo(this.endX, this.endY)
  }
  
  /**
   * 更新连线坐标
   * @param {number} startX - 新的起始X坐标
   * @param {number} startY - 新的起始Y坐标
   * @param {number} endX - 新的结束X坐标
   * @param {number} endY - 新的结束Y坐标
   */
  update(startX, startY, endX, endY) {
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    
    // 重新绘制
    this.draw()
  }
}

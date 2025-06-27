import { Container, Graphics, Text } from 'pixi.js'

/**
 * 节点精灵类，用于渲染树中的单个节点
 */
export default class NodeSprite extends Container {
  /**
   * 创建一个新的节点精灵
   * @param {Object} nodeData - 节点数据
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {Object} options - 配置选项
   */
  constructor(nodeData, x, y, options = {}) {
    super()
    
    // 存储节点数据
    this.nodeData = nodeData
    
    // 设置位置
    this.position.set(x, y)
    
    // 节点尺寸
    this.width = options.width || 200
    this.height = options.height || 30
    
    // 选中状态
    this.isSelected = options.selected || false
    
    // 节点类型
    this.nodeType = options.nodeType || (nodeData.data?.type || 'department')
    
    // 渲染节点
    this.render()
    
    // 添加交互
    this.setupInteraction()
  }
  
  /**
   * 渲染节点
   */
  render() {
    // 移除之前的子元素
    this.removeChildren()
    
    // 创建背景 - 根据选中状态使用不同颜色
    this.background = new Graphics()
    this.background.beginFill(this.isSelected ? 0xbbdefb : 0xf5f5f5)
    this.background.lineStyle(1, this.isSelected ? 0x2196f3 : 0xcccccc)
    this.background.drawRoundedRect(0, 0, this.width, this.height, 4)
    this.background.endFill()
    this.addChild(this.background)
    
    // 创建展开/折叠指示器（如果有子节点）
    if (this.nodeData.children && this.nodeData.children.length > 0) {
      this.expandIcon = new Graphics()
      this.expandIcon.beginFill(0x333333)
      
      // 绘制不同图标取决于展开状态
      if (this.nodeData.expanded) {
        // 展开状态 - 绘制减号
        this.expandIcon.drawRect(6, 14, 8, 2)
      } else {
        // 折叠状态 - 绘制加号
        this.expandIcon.drawRect(6, 14, 8, 2)
        this.expandIcon.drawRect(9, 11, 2, 8)
      }
      
      this.expandIcon.endFill()
      this.addChild(this.expandIcon)
    }
    
    // 创建复选框
    this.checkbox = new Graphics()
    this.checkbox.beginFill(0xffffff)
    this.checkbox.lineStyle(1, 0xaaaaaa)
    this.checkbox.drawRect(20, 8, 14, 14)
    this.checkbox.endFill()
    this.addChild(this.checkbox)
    
    // 如果节点被选中，填充复选框
    if (this.isSelected) {
      this.checkbox.beginFill(0x2196f3)
      this.checkbox.drawRect(22, 10, 10, 10)
      this.checkbox.endFill()
    }
    
    // 根据节点类型使用不同图标或颜色
    let nameX = 44;
    if (this.nodeType === 'employee') {
      // 员工图标
      const icon = new Graphics()
      icon.beginFill(0x666666)
      icon.drawCircle(44, 15, 4)
      icon.endFill()
      this.addChild(icon)
      nameX = 54;
    }
    
    // 创建文本
    this.text = new Text(this.nodeData.name, {
      fontSize: 12,
      fill: 0x333333,
      fontFamily: 'Arial'
    })
    this.text.position.set(nameX, 8)
    this.addChild(this.text)
  }
  
  /**
   * 设置交互
   */
  setupInteraction() {
    // 使节点可交互
    this.interactive = true
    this.buttonMode = true
    
    // 鼠标悬停效果
    this.on('mouseover', this.onMouseOver.bind(this))
    this.on('mouseout', this.onMouseOut.bind(this))
  }
  
  /**
   * 更新选中状态
   * @param {boolean} selected - 是否选中
   */
  updateSelection(selected) {
    if (this.isSelected !== selected) {
      this.isSelected = selected
      this.render()
    }
  }
  
  /**
   * 鼠标悬停处理
   */
  onMouseOver() {
    this.background.tint = 0xeeeeee
  }
  
  /**
   * 鼠标移出处理
   */
  onMouseOut() {
    this.background.tint = 0xffffff
  }
  
  /**
   * 更新节点数据
   * @param {Object} nodeData - 新的节点数据
   */
  update(nodeData) {
    this.nodeData = nodeData
    
    // 重新渲染
    this.render()
  }
}

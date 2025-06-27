import { Graphics } from 'pixi.js'

/**
 * 交互管理器，处理树的交互事件
 */
export default class InteractionManager {
  /**
   * 创建交互管理器
   * @param {Object} viewport - PixiJS视口
   * @param {Object} treeRenderer - 树渲染器
   */
  constructor(viewport, treeRenderer) {
    this.viewport = viewport
    this.treeRenderer = treeRenderer
    this.selectedNodes = new Set()
    this.selectionRect = null
    
    // 初始化
    this.init()
  }
  
  /**
   * 初始化交互管理器
   */
  init() {
    // 为节点添加交互事件监听
    this.setupNodeEvents()
    
    // 设置框选功能
    this.setupRectangleSelection()
  }
  
  /**
   * 为节点添加事件监听
   */
  setupNodeEvents() {
    // 监听节点切换事件
    this.treeRenderer.treeContainer.on('node:toggle', this.onNodeToggle.bind(this))
    
    // 监听节点选择事件
    this.treeRenderer.treeContainer.on('node:select', this.onNodeSelect.bind(this))
  }
  
  /**
   * 设置框选功能
   */
  setupRectangleSelection() {
    // 创建选择矩形
    this.selectionRect = new Graphics()
    this.viewport.addChild(this.selectionRect)
    
    // 存储开始点
    let startPoint = null
    
    // 鼠标按下
    this.viewport.on('mousedown', (event) => {
      // 只有按住Ctrl或Meta键才启用框选
      if (event.data.originalEvent.ctrlKey || event.data.originalEvent.metaKey) {
        startPoint = event.data.getLocalPosition(this.viewport)
        
        // 初始绘制选择矩形
        this.selectionRect.clear()
        this.selectionRect.beginFill(0x2196f3, 0.2)
        this.selectionRect.lineStyle(1, 0x2196f3)
        this.selectionRect.drawRect(startPoint.x, startPoint.y, 0, 0)
        this.selectionRect.endFill()
      }
    })
    
    // 鼠标移动
    this.viewport.on('mousemove', (event) => {
      if (startPoint) {
        const currentPoint = event.data.getLocalPosition(this.viewport)
        
        // 更新选择矩形
        this.selectionRect.clear()
        this.selectionRect.beginFill(0x2196f3, 0.2)
        this.selectionRect.lineStyle(1, 0x2196f3)
        this.selectionRect.drawRect(
          startPoint.x,
          startPoint.y,
          currentPoint.x - startPoint.x,
          currentPoint.y - startPoint.y
        )
        this.selectionRect.endFill()
      }
    })
    
    // 鼠标释放
    this.viewport.on('mouseup', (event) => {
      if (startPoint) {
        // 获取选择矩形的边界
        const bounds = this.selectionRect.getBounds()
        
        // 查找矩形内的节点
        this.selectNodesInBounds(bounds, event.data.originalEvent.shiftKey)
        
        // 清理
        startPoint = null
        this.selectionRect.clear()
      }
    })
  }
  
  /**
   * 节点切换事件处理
   * @param {Object} nodeData - 节点数据
   */
  onNodeToggle(nodeData) {
    // 重新渲染树
    this.treeRenderer.renderTree()
  }
  
  /**
   * 节点选择事件处理
   * @param {Object} nodeData - 节点数据
   */
  onNodeSelect(nodeData) {
    if (nodeData.selected) {
      this.selectedNodes.add(nodeData.id)
    } else {
      this.selectedNodes.delete(nodeData.id)
    }
    
    // 触发选择变化事件
    this.viewport.emit('selection:change', this.selectedNodes)
  }
  
  /**
   * 选择指定边界内的节点
   * @param {Object} bounds - 边界矩形
   * @param {boolean} additive - 是否为添加选择（按住Shift）
   */
  selectNodesInBounds(bounds, additive) {
    // 如果不是添加选择，清除现有选择
    if (!additive) {
      this.selectedNodes.clear()
    }
    
    // 遍历所有节点精灵
    this.treeRenderer.nodeSprites.forEach((sprite, id) => {
      // 检查节点是否在选择框内
      if (bounds.contains(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2)) {
        // 更新节点选中状态
        const nodeData = sprite.nodeData
        nodeData.selected = true
        sprite.update(nodeData)
        
        // 添加到选中集合
        this.selectedNodes.add(id)
      }
    })
    
    // 触发选择变化事件
    this.viewport.emit('selection:change', this.selectedNodes)
  }
  
  /**
   * 获取选中节点数量
   * @returns {number} 选中节点数量
   */
  getSelectedCount() {
    return this.selectedNodes.size
  }
  
  /**
   * 清除所有选择
   */
  clearSelection() {
    // 清除选择集合
    this.selectedNodes.clear()
    
    // 更新所有节点状态
    this.treeRenderer.nodeSprites.forEach((sprite) => {
      const nodeData = sprite.nodeData
      nodeData.selected = false
      sprite.update(nodeData)
    })
    
    // 触发选择变化事件
    this.viewport.emit('selection:change', this.selectedNodes)
  }
  
  /**
   * 销毁交互管理器
   */
  destroy() {
    // 移除事件监听
    this.treeRenderer.treeContainer.off('node:toggle')
    this.treeRenderer.treeContainer.off('node:select')
    
    // 移除选择矩形
    if (this.selectionRect) {
      this.viewport.removeChild(this.selectionRect)
      this.selectionRect.destroy()
    }
  }
}

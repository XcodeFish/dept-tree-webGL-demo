import { Container, Graphics, Text } from 'pixi.js'
import NodeSprite from './NodeSprite.js'
import ConnectionSprite from './ConnectionSprite.js'

/**
 * 负责处理树结构的渲染
 */
export default class TreeRenderer {
  /**
   * 构造函数
   * @param {Viewport} viewport - PixiJS视口对象
   * @param {Application} app - PixiJS应用实例
   * @param {Object} options - 渲染选项
   */
  constructor(viewport, app, options = {}) {
    this.viewport = viewport
    this.app = app
    this.treeContainer = new Container()
    this.nodeSprites = new Map()
    this.selectedNodes = new Set()
    
    // 渲染选项
    this.options = {
      nodeWidth: options.nodeWidth || 200,
      nodeHeight: options.nodeHeight || 30,
      levelHeight: options.levelHeight || 60,
      nodePadding: options.nodePadding || 20,
      useInstancing: options.useInstancing || false,
      useQuadTree: options.useQuadTree || false
    }
    
    // 树数据
    this.treeData = null
    
    // 添加树容器到视口
    viewport.addChild(this.treeContainer)
    
    // 初始化
    this.init()
  }
  
  /**
   * 初始化渲染器
   */
  init() {
    // 添加主循环
    this.app.ticker.add(this.update.bind(this))
  }
  
  /**
   * 设置树数据
   * @param {Object} treeData - 树形数据结构
   */
  setTreeData(treeData) {
    this.treeData = treeData
  }
  
  /**
   * 获取当前选中的节点数量
   * @returns {number} 选中节点数量
   */
  getSelectedCount() {
    return this.selectedNodes.size
  }
  
  /**
   * 切换节点选中状态
   * @param {string} nodeId - 节点ID
   * @param {boolean} selected - 是否选中，不传则切换
   */
  toggleNodeSelection(nodeId, selected) {
    if (selected === undefined) {
      // 切换状态
      if (this.selectedNodes.has(nodeId)) {
        this.selectedNodes.delete(nodeId)
      } else {
        this.selectedNodes.add(nodeId)
      }
    } else {
      // 设置为指定状态
      if (selected) {
        this.selectedNodes.add(nodeId)
      } else {
        this.selectedNodes.delete(nodeId)
      }
    }
    
    // 更新节点外观
    const nodeSprite = this.nodeSprites.get(nodeId)
    if (nodeSprite) {
      nodeSprite.updateSelection(this.selectedNodes.has(nodeId))
    }
  }
  
  /**
   * 切换节点展开状态
   * @param {string} nodeId - 节点ID
   * @param {boolean} expanded - 是否展开，不传则切换
   */
  toggleNodeExpanded(nodeId, expanded) {
    // 递归查找节点
    const findAndToggleNode = (node) => {
      if (node.id === nodeId) {
        if (expanded === undefined) {
          node.expanded = !node.expanded
        } else {
          node.expanded = expanded
        }
        return true
      }
      
      if (node.children) {
        for (const child of node.children) {
          if (findAndToggleNode(child)) {
            return true
          }
        }
      }
      
      return false
    }
    
    if (this.treeData && findAndToggleNode(this.treeData)) {
      this.renderTree()
    }
  }
  
  /**
   * 渲染树结构
   */
  renderTree() {
    // 清除现有内容
    this.treeContainer.removeChildren()
    this.nodeSprites.clear()
    
    // 检查是否有树数据
    if (!this.treeData) return
    
    // 从根节点开始递归渲染
    this.renderNode(this.treeData, 0, 0)
    
    // 将视口定位到中心
    this.viewport.moveCenter(0, 0)
  }
  
  /**
   * 递归渲染节点
   * @param {Object} node - 节点数据
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @returns {Object} 包含节点尺寸信息
   */
  renderNode(node, x, y) {
    const nodeWidth = this.options.nodeWidth
    const nodeHeight = this.options.nodeHeight
    const levelHeight = this.options.levelHeight
    const nodePadding = this.options.nodePadding
    
    // 创建节点精灵
    const nodeSprite = new NodeSprite(node, x, y, {
      width: nodeWidth,
      height: nodeHeight,
      selected: this.selectedNodes.has(node.id)
    })
    
    // 添加点击事件
    nodeSprite.on('click', (event) => {
      // 获取本地点击位置
      const localPos = event.data.getLocalPosition(nodeSprite)
      
      // 检查是否点击在复选框区域
      if (localPos.x >= 10 && localPos.x <= 24 && localPos.y >= 8 && localPos.y <= 22) {
        // 切换选中状态
        this.toggleNodeSelection(node.id)
      } else if (node.children && node.children.length > 0) {
        // 切换展开状态
        this.toggleNodeExpanded(node.id)
      }
    })
    
    this.treeContainer.addChild(nodeSprite)
    this.nodeSprites.set(node.id, nodeSprite)
    
    // 如果节点展开且有子节点，渲染子节点
    if (node.expanded && node.children && node.children.length > 0) {
      const childrenWidth = node.children.length * (nodeWidth + nodePadding) - nodePadding
      let startX = x - (childrenWidth / 2) + (nodeWidth / 2)
      
      // 渲染子节点
      node.children.forEach((child, index) => {
        const childX = startX + index * (nodeWidth + nodePadding)
        const childY = y + levelHeight
        
        // 渲染连线
        const connection = new ConnectionSprite(x + nodeWidth / 2, y + nodeHeight, childX + nodeWidth / 2, childY)
        this.treeContainer.addChild(connection)
        
        // 渲染子节点
        this.renderNode(child, childX, childY)
      })
    }
    
    return { width: nodeWidth, height: nodeHeight }
  }
  
  /**
   * 主循环更新
   */
  update(delta) {
    // 可以在这里添加动画或其他更新逻辑
  }
  
  /**
   * 销毁渲染器
   */
  destroy() {
    this.app.ticker.remove(this.update.bind(this))
    this.treeContainer.destroy({ children: true })
    this.nodeSprites.clear()
    this.selectedNodes.clear()
  }
}

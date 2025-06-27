# 部门树WebGL Demo API文档

## 组件API

### DeptTree 组件

部门树主组件，用于渲染和管理树形结构。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| treeData | Object | - | 树形数据结构，必填 |
| width | Number | 100% | 组件宽度 |
| height | Number | 500 | 组件高度 |
| nodeWidth | Number | 200 | 节点宽度 |
| nodeHeight | Number | 30 | 节点高度 |
| levelHeight | Number | 60 | 层级间距 |
| initialScale | Number | 1 | 初始缩放比例 |
| searchable | Boolean | true | 是否可搜索 |
| multiSelect | Boolean | true | 是否允许多选 |

#### 事件

| 事件名 | 参数 | 说明 |
|-------|------|------|
| node-select | (nodeId, isSelected) | 节点选择状态变化时触发 |
| node-toggle | (nodeId, isExpanded) | 节点展开/折叠状态变化时触发 |
| selection-change | (selectedIds) | 选择集合变化时触发 |
| search-result | (results) | 搜索结果变化时触发 |

#### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|--------|------|
| getSelectedNodes | - | Array | 获取当前选中的节点 |
| expandNode | (nodeId, deep) | void | 展开指定节点，deep为true时递归展开子节点 |
| collapseNode | (nodeId, deep) | void | 折叠指定节点，deep为true时递归折叠子节点 |
| expandAll | - | void | 展开所有节点 |
| collapseAll | - | void | 折叠所有节点 |
| focusNode | (nodeId) | void | 将视图定位到指定节点 |
| searchNodes | (keyword) | Array | 搜索节点，返回匹配的节点ID数组 |
| clearSelection | - | void | 清除所有选择 |
| resetView | - | void | 重置视图到初始状态 |

#### 插槽

| 插槽名 | 插槽作用域 | 说明 |
|-------|------------|------|
| node-content | { node, isSelected } | 自定义节点内容 |
| toolbar | - | 自定义工具栏内容 |
| empty | - | 无数据时的显示内容 |

### SearchPanel 组件

搜索面板组件，用于搜索和过滤树节点。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| placeholder | String | '搜索部门或人员' | 搜索框占位文本 |
| debounce | Number | 300 | 搜索防抖延迟(ms) |

#### 事件

| 事件名 | 参数 | 说明 |
|-------|------|------|
| search | (keyword) | 搜索关键词变化时触发 |
| clear | - | 清除搜索时触发 |

### PerformanceMonitor 组件

性能监控组件，用于显示和记录性能指标。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| visible | Boolean | true | 是否显示监控面板 |
| position | String | 'bottom-right' | 面板位置 |

#### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|--------|------|
| startMeasure | (label) | void | 开始测量指定操作的性能 |
| endMeasure | (label) | Object | 结束测量，返回性能指标 |
| getStats | - | Object | 获取当前性能统计数据 |

## 工具类API

### TreeRenderer

树渲染器，负责管理树的WebGL渲染。

#### 构造函数

```js
new TreeRenderer(viewport, app, options)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| viewport | Viewport | PixiJS视口对象 |
| app | Application | PixiJS应用实例 |
| options | Object | 渲染选项 |

#### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|--------|------|
| renderTree | (treeData) | void | 渲染树结构 |
| update | - | void | 更新渲染 |
| destroy | - | void | 销毁渲染器 |

### NodeSprite

节点精灵类，用于渲染单个树节点。

#### 构造函数

```js
new NodeSprite(nodeData, x, y)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| nodeData | Object | 节点数据 |
| x | Number | X坐标 |
| y | Number | Y坐标 |

#### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|--------|------|
| render | - | void | 渲染节点 |
| update | (nodeData) | void | 更新节点数据和渲染 |

### InteractionManager

交互管理器，处理用户与树的交互。

#### 构造函数

```js
new InteractionManager(viewport, treeRenderer)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| viewport | Viewport | PixiJS视口对象 |
| treeRenderer | TreeRenderer | 树渲染器实例 |

#### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|--------|------|
| setupNodeEvents | - | void | 设置节点交互事件 |
| setupRectangleSelection | - | void | 设置框选功能 |
| getSelectedCount | - | Number | 获取选中节点数量 |
| clearSelection | - | void | 清除所有选择 |

## Composables API

### useTreeData

树数据处理组合式函数。

```js
const {
  treeData,
  fetchTreeData,
  filterTree,
  expandNode,
  collapseNode,
  expandAll,
  collapseAll
} = useTreeData(options)
```

### useTreeLayout

树布局计算组合式函数。

```js
const {
  calculateLayout,
  getVisibleNodes,
  getNodePosition
} = useTreeLayout(options)
```

### useTreeSelection

树节点选择管理组合式函数。

```js
const {
  selectedNodes,
  toggleSelection,
  selectMultiple,
  getSelectedCount,
  clearSelection
} = useTreeSelection()
```

### usePerformanceMonitor

性能监控组合式函数。

```js
const {
  fps,
  memory,
  renderTime,
  startMeasure,
  endMeasure
} = usePerformanceMonitor()
```

## 数据结构

### 树节点数据结构

```typescript
interface TreeNode {
  id: string;           // 节点唯一标识符
  name: string;         // 节点名称
  expanded?: boolean;   // 是否展开
  selected?: boolean;   // 是否选中
  children?: TreeNode[]; // 子节点数组
  data?: any;           // 附加数据
}
```

### 渲染选项

```typescript
interface RenderOptions {
  nodeWidth: number;    // 节点宽度
  nodeHeight: number;   // 节点高度
  levelHeight: number;  // 层级间距
  nodePadding: number;  // 节点间距
  useInstancing: boolean; // 是否使用实例化渲染
  useQuadTree: boolean; // 是否使用四叉树优化
}
```

## WebWorker 消息接口

### 布局计算

发送消息格式：

```js
{
  type: 'CALCULATE_LAYOUT',
  data: {
    treeData: TreeNode,
    options: RenderOptions
  }
}
```

接收消息格式：

```js
{
  type: 'LAYOUT_COMPLETED',
  data: {
    nodes: Array<{id: string, x: number, y: number, width: number, height: number}>,
    connections: Array<{from: string, to: string, points: Array<{x: number, y: number}>}>
  }
}
```

### 节点过滤

发送消息格式：

```js
{
  type: 'FILTER_NODES',
  data: {
    nodes: Array<TreeNode>,
    keyword: string
  }
}
```

接收消息格式：

```js
{
  type: 'FILTER_COMPLETED',
  data: Array<string> // 匹配节点ID
}
```

## 性能指标

| 指标名 | 单位 | 目标值 | 说明 |
|-------|------|-------|------|
| FPS | 帧/秒 | ≥60 | 每秒渲染帧数 |
| 渲染时间 | ms | <16 | 单帧渲染时间 |
| 内存占用 | MB | <500 | 运行时内存占用 |
| 初始渲染 | ms | <1000 | 首次渲染完成时间 |
| 交互延迟 | ms | <50 | 交互响应延迟 |

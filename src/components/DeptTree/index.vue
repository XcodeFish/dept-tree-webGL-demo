<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Application, Container } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { ElInput, ElButton } from 'element-plus'
import TreeRenderer from './TreeRenderer.js'

// 定义组件属性
const props = defineProps({
  treeData: {
    type: Object,
    default: null
  },
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '100%'
  },
  nodeWidth: {
    type: Number,
    default: 200
  },
  nodeHeight: {
    type: Number,
    default: 30
  },
  levelHeight: {
    type: Number,
    default: 60
  },
  initialScale: {
    type: Number,
    default: 1
  }
})

// PixiJS应用和视口引用
const pixiContainer = ref(null)
const searchText = ref('')
let app = null
let viewport = null
let treeRenderer = null

// 初始化PixiJS应用
onMounted(() => {
  if (!pixiContainer.value) return

  // 创建PIXI应用
  app = new Application({
    width: pixiContainer.value.clientWidth,
    height: pixiContainer.value.clientHeight,
    backgroundColor: 0xffffff,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  })

  pixiContainer.value.appendChild(app.view)

  // 创建可缩放、平移的视口
  viewport = new Viewport({
    screenWidth: app.view.width,
    screenHeight: app.view.height,
    worldWidth: 10000,
    worldHeight: 10000,
    interaction: app.renderer.plugins.interaction
  })

  app.stage.addChild(viewport)
  viewport.drag().pinch().wheel()

  // 初始化树渲染器
  treeRenderer = new TreeRenderer(viewport, app, {
    nodeWidth: props.nodeWidth,
    nodeHeight: props.nodeHeight,
    levelHeight: props.levelHeight
  })

  // 如果已有树数据，立即渲染
  if (props.treeData) {
    treeRenderer.setTreeData(props.treeData)
    treeRenderer.renderTree()
  }

  // 窗口大小调整处理
  const handleResize = () => {
    if (!app || !pixiContainer.value) return
    app.renderer.resize(
      pixiContainer.value.clientWidth,
      pixiContainer.value.clientHeight
    )
    viewport.resize(
      pixiContainer.value.clientWidth,
      pixiContainer.value.clientHeight
    )
  }

  window.addEventListener('resize', handleResize)

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (app) {
      app.destroy(true, { children: true, texture: true, baseTexture: true })
    }
  })
})

// 监听树数据变化
watch(() => props.treeData, (newData) => {
  if (newData && treeRenderer) {
    console.time('树渲染')
    treeRenderer.setTreeData(newData)
    treeRenderer.renderTree()
    console.timeEnd('树渲染')
  }
}, { deep: true })

// 搜索处理
const handleSearch = () => {
  // 这里将添加搜索逻辑
  console.log('搜索:', searchText.value)
}

// 选择处理
const getSelectedCount = () => {
  return treeRenderer ? treeRenderer.getSelectedCount() : 0
}

// 邀请选中人员
const inviteSelected = () => {
  console.log('邀请选中人员')
}
</script>

<template>
  <div class="dept-tree-container">
    <div class="toolbar">
      <ElInput
        v-model="searchText"
        placeholder="搜索部门或人员"
        @input="handleSearch"
        clearable
      />
      <div class="selection-info">
        已选: {{ getSelectedCount() }} 人
      </div>
      <ElButton type="primary" @click="inviteSelected">
        邀请所选人员
      </ElButton>
    </div>

    <div
      ref="pixiContainer"
      class="pixi-container"
    ></div>
  </div>
</template>

<style scoped>
.dept-tree-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 15px;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
}

.selection-info {
  margin-left: auto;
  font-size: 14px;
  color: #606266;
}

.pixi-container {
  flex: 1;
  overflow: hidden;
}
</style>

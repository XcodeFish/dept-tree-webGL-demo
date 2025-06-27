<script setup>
import { ref, onMounted } from 'vue'
import DeptTree from './components/DeptTree/index.vue'
import PerformanceMonitor from './components/PerformanceMonitor.vue'
import { 
  generateSmallTree, 
  generateMediumTree, 
  generateLargeTree,
  generateHugeTree,
  countNodes
} from './utils/treeGenerator'

// 应用标题
const title = ref('部门树WebGL Demo')

// 树数据
const treeData = ref(null)

// 当前选择的数据规模
const dataSize = ref('small')

// 树节点计数
const nodeCount = ref(0)

// 生成树数据
const generateTree = (size = 'small') => {
  console.time('生成树数据')
  
  switch(size) {
    case 'small':
      treeData.value = generateSmallTree()
      break
    case 'medium':
      treeData.value = generateMediumTree()
      break
    case 'large':
      treeData.value = generateLargeTree()
      break
    case 'huge':
      treeData.value = generateHugeTree()
      break
    default:
      treeData.value = generateSmallTree()
  }
  
  console.timeEnd('生成树数据')
  
  // 计算节点总数
  nodeCount.value = countNodes(treeData.value)
}

// 切换数据规模
const handleSizeChange = (size) => {
  dataSize.value = size
  generateTree(size)
}

// 组件挂载时生成初始树数据
onMounted(() => {
  generateTree(dataSize.value)
})
</script>

<template>
  <div class="app-container">
    <header>
      <h1>{{ title }}</h1>
      <div class="controls">
        <span class="node-count">当前节点数: {{ nodeCount }}</span>
        <div class="buttons">
          <button 
            @click="handleSizeChange('small')" 
            :class="{ active: dataSize === 'small' }"
          >
            小型树
          </button>
          <button 
            @click="handleSizeChange('medium')" 
            :class="{ active: dataSize === 'medium' }"
          >
            中型树
          </button>
          <button 
            @click="handleSizeChange('large')" 
            :class="{ active: dataSize === 'large' }"
          >
            大型树
          </button>
          <button 
            @click="handleSizeChange('huge')" 
            :class="{ active: dataSize === 'huge' }"
          >
            超大型树
          </button>
        </div>
      </div>
    </header>
    <main>
      <DeptTree v-if="treeData" :tree-data="treeData" />
      <div v-else class="loading">加载中...</div>
    </main>
    <PerformanceMonitor />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.node-count {
  font-size: 14px;
  color: #666;
}

.buttons {
  display: flex;
  gap: 10px;
}

button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background-color: #e0e0e0;
}

button.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

main {
  flex: 1;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #666;
}
</style>

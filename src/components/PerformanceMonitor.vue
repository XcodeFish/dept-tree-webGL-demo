<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Stats from 'stats.js'

// 性能指标
const fps = ref(0)
const memory = ref(0)
const renderTime = ref(0)

// Stats实例
let stats = null

onMounted(() => {
  // 创建Stats实例
  stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb
  document.body.appendChild(stats.dom)

  // 设置样式
  stats.dom.style.position = 'absolute'
  stats.dom.style.top = '10px'
  stats.dom.style.right = '10px'

  // 开始监控
  requestAnimationFrame(function loop() {
    stats.begin()

    // 更新指标
    fps.value = Math.round(stats.panel.fps)
    
    // 如果内存面板可用
    if (window.performance && window.performance.memory) {
      memory.value = Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024)
    }

    stats.end()
    requestAnimationFrame(loop)
  })
})

onUnmounted(() => {
  // 清理
  if (stats && stats.dom && stats.dom.parentNode) {
    stats.dom.parentNode.removeChild(stats.dom)
  }
})

// 开始测量性能
const startMeasure = (label) => {
  performance.mark(`${label}-start`)
}

// 结束测量性能
const endMeasure = (label) => {
  performance.mark(`${label}-end`)
  performance.measure(label, `${label}-start`, `${label}-end`)
  const entries = performance.getEntriesByName(label)
  if (entries.length > 0) {
    renderTime.value = entries[0].duration.toFixed(2)
  }
  performance.clearMarks()
  performance.clearMeasures()
}
</script>

<template>
  <div class="performance-monitor">
    <div class="metric">
      <span class="label">FPS:</span>
      <span class="value" :class="{ 'warning': fps < 45, 'danger': fps < 30 }">{{ fps }}</span>
    </div>
    <div class="metric" v-if="memory > 0">
      <span class="label">内存:</span>
      <span class="value">{{ memory }} MB</span>
    </div>
    <div class="metric" v-if="renderTime > 0">
      <span class="label">渲染时间:</span>
      <span class="value">{{ renderTime }} ms</span>
    </div>
  </div>
</template>

<style scoped>
.performance-monitor {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-family: monospace;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;
}

.metric {
  display: flex;
  justify-content: space-between;
}

.label {
  margin-right: 8px;
}

.value {
  font-weight: bold;
  color: #4caf50;
}

.warning {
  color: #ff9800;
}

.danger {
  color: #f44336;
}
</style>

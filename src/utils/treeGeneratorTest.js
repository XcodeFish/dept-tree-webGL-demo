/**
 * 树数据生成器测试文件
 * 用于测试树数据生成器的功能和性能
 */

import {
  generateSmallTree,
  generateMediumTree,
  generateLargeTree,
  generateHugeTree,
  generateTreeWithNodeCount,
  countNodes
} from './treeGenerator';

// 测试不同规模的树生成
console.log('===== 树数据生成器测试 =====');

// 生成小型树
console.time('生成小型树');
const smallTree = generateSmallTree();
console.timeEnd('生成小型树');
console.log(`小型树节点数: ${countNodes(smallTree)}`);

// 生成中型树
console.time('生成中型树');
const mediumTree = generateMediumTree();
console.timeEnd('生成中型树');
console.log(`中型树节点数: ${countNodes(mediumTree)}`);

// 生成大型树
console.time('生成大型树');
const largeTree = generateLargeTree();
console.timeEnd('生成大型树');
console.log(`大型树节点数: ${countNodes(largeTree)}`);

// 生成特定节点数的树
console.time('生成1000节点的树');
const customTree = generateTreeWithNodeCount(1000);
console.timeEnd('生成1000节点的树');
const actualCount = countNodes(customTree);
console.log(`目标节点数: 1000, 实际节点数: ${actualCount}, 误差: ${Math.abs(actualCount - 1000) / 10}%`);

// 树结构示例 (只显示第一层)
console.log('\n===== 树结构示例 =====');
console.log(`根节点: ${smallTree.name}`);
console.log('第一层子节点:');
if (smallTree.children) {
  smallTree.children.forEach((child, index) => {
    console.log(`  ${index + 1}. ${child.name} (${countNodes(child)}个子节点)`);
  });
}

// 导出用于测试的树数据，可以用于Vue组件中
export {
  smallTree,
  mediumTree,
  largeTree,
  customTree
}; 
/**
 * 树数据生成器 - 用于生成测试用的部门树数据
 * 支持生成不同规模和深度的树结构，可用于性能测试和功能验证
 */

// 部门名称前缀
const DEPT_PREFIX = '部门';
// 人员名称前缀
const EMPLOYEE_PREFIX = '员工';
// 部门层级深度默认值
const DEFAULT_DEPTH = 4;
// 默认每层最大子节点数
const DEFAULT_CHILDREN_COUNT = 5;
// 默认部门名称长度范围
const NAME_LENGTH_RANGE = [4, 8];
// 默认根节点ID
const ROOT_ID = 'root';

/**
 * 生成随机的部门名称
 * @param {number} prefixIndex - 部门索引
 * @param {number} minLength - 最小长度
 * @param {number} maxLength - 最大长度
 * @returns {string} 随机生成的部门名称
 */
const generateDeptName = (prefixIndex, minLength = NAME_LENGTH_RANGE[0], maxLength = NAME_LENGTH_RANGE[1]) => {
  const nameLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const chars = '技术研发市场销售人力资源财务行政运营客服产品设计质量测试数据安全法务战略';
  let name = '';
  for (let i = 0; i < nameLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    name += chars[randomIndex];
  }
  return `${DEPT_PREFIX}${prefixIndex}-${name}`;
};

/**
 * 生成随机的员工名称
 * @param {number} index - 员工索引
 * @returns {string} 随机生成的员工名称
 */
const generateEmployeeName = (index) => {
  const firstNames = '张王李赵钱孙周吴郑陈刘蒋沈韩杨朱秦许何吕施孔曹';
  const lastNames = '伟芳娜秀英明军红霞峰强静敏磊丽娟涛超杰';
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${EMPLOYEE_PREFIX}${index}-${firstName}${lastName}`;
};

/**
 * 递归生成树节点
 * @param {string} id - 节点ID
 * @param {string} name - 节点名称
 * @param {number} depth - 当前深度
 * @param {number} maxDepth - 最大深度
 * @param {number} maxChildren - 每个节点的最大子节点数
 * @param {number} minChildren - 每个节点的最小子节点数
 * @param {boolean} isExpandedByDefault - 默认是否展开
 * @param {Object} counter - 用于生成唯一ID的计数器
 * @param {Object} options - 其他选项
 * @returns {Object} 生成的树节点
 */
const generateNode = (
  id,
  name,
  depth,
  maxDepth,
  maxChildren,
  minChildren,
  isExpandedByDefault,
  counter,
  options
) => {
  const node = {
    id,
    name,
    expanded: depth <= (options.initialExpandedDepth || 1),
    selected: false,
    data: {
      level: depth,
      type: depth === maxDepth ? 'employee' : 'department'
    }
  };

  // 如果已经达到最大深度，不再生成子节点
  if (depth >= maxDepth) {
    return node;
  }

  // 随机决定当前节点的子节点数量
  const childrenCount = Math.floor(Math.random() * (maxChildren - minChildren + 1)) + minChildren;
  node.children = [];

  // 生成子节点
  for (let i = 0; i < childrenCount; i++) {
    const childId = `${id}-${counter.value++}`;
    let childName;
    
    // 根据深度决定是部门还是员工
    if (depth === maxDepth - 1) {
      childName = generateEmployeeName(counter.value);
    } else {
      childName = generateDeptName(counter.value);
    }
    
    const childNode = generateNode(
      childId,
      childName,
      depth + 1,
      maxDepth,
      maxChildren,
      minChildren,
      isExpandedByDefault,
      counter,
      options
    );
    
    node.children.push(childNode);
  }

  return node;
};

/**
 * 生成树形数据
 * @param {Object} options - 配置选项
 * @param {string} [options.rootName='组织架构'] - 根节点名称
 * @param {number} [options.maxDepth=4] - 树的最大深度
 * @param {number} [options.maxChildrenPerNode=5] - 每个节点的最大子节点数
 * @param {number} [options.minChildrenPerNode=2] - 每个节点的最小子节点数
 * @param {number} [options.initialExpandedDepth=1] - 初始展开到的深度
 * @param {boolean} [options.expandAll=false] - 是否展开所有节点
 * @returns {Object} 生成的树形数据
 */
export const generateTreeData = (options = {}) => {
  const {
    rootName = '组织架构',
    maxDepth = DEFAULT_DEPTH,
    maxChildrenPerNode = DEFAULT_CHILDREN_COUNT,
    minChildrenPerNode = Math.max(1, Math.floor(maxChildrenPerNode / 2)),
    initialExpandedDepth = 1,
    expandAll = false
  } = options;

  const counter = { value: 1 };
  
  return generateNode(
    ROOT_ID,
    rootName,
    0,
    maxDepth,
    maxChildrenPerNode,
    minChildrenPerNode,
    expandAll,
    counter,
    { initialExpandedDepth }
  );
};

/**
 * 生成小型树数据 (约100-500节点)
 * @returns {Object} 生成的小型树形数据
 */
export const generateSmallTree = () => {
  return generateTreeData({
    rootName: '小型组织',
    maxDepth: 3,
    maxChildrenPerNode: 4,
    minChildrenPerNode: 2,
    initialExpandedDepth: 2
  });
};

/**
 * 生成中型树数据 (约1000-5000节点)
 * @returns {Object} 生成的中型树形数据
 */
export const generateMediumTree = () => {
  return generateTreeData({
    rootName: '中型组织',
    maxDepth: 4,
    maxChildrenPerNode: 8,
    minChildrenPerNode: 3,
    initialExpandedDepth: 1
  });
};

/**
 * 生成大型树数据 (约10000-50000节点)
 * @returns {Object} 生成的大型树形数据
 */
export const generateLargeTree = () => {
  return generateTreeData({
    rootName: '大型组织',
    maxDepth: 5,
    maxChildrenPerNode: 10,
    minChildrenPerNode: 5,
    initialExpandedDepth: 1
  });
};

/**
 * 生成超大型树数据 (10万节点以上)
 * 警告：可能导致性能问题，仅用于性能测试
 * @returns {Object} 生成的超大型树形数据
 */
export const generateHugeTree = () => {
  return generateTreeData({
    rootName: '超大型组织',
    maxDepth: 6,
    maxChildrenPerNode: 12,
    minChildrenPerNode: 8,
    initialExpandedDepth: 1
  });
};

/**
 * 计算树中节点总数
 * @param {Object} treeData - 树数据
 * @returns {number} 节点总数
 */
export const countNodes = (treeData) => {
  if (!treeData) return 0;
  
  let count = 1; // 当前节点
  
  if (treeData.children && treeData.children.length > 0) {
    treeData.children.forEach(child => {
      count += countNodes(child);
    });
  }
  
  return count;
};

/**
 * 生成指定节点数量的树
 * @param {number} targetNodeCount - 目标节点数量
 * @returns {Object} 生成的树形数据
 */
export const generateTreeWithNodeCount = (targetNodeCount) => {
  // 根据目标节点数估算参数
  let maxDepth, maxChildren, minChildren;
  
  if (targetNodeCount <= 500) {
    maxDepth = 3;
    maxChildren = 4;
    minChildren = 2;
  } else if (targetNodeCount <= 5000) {
    maxDepth = 4;
    maxChildren = 8;
    minChildren = 3;
  } else if (targetNodeCount <= 50000) {
    maxDepth = 5;
    maxChildren = 10;
    minChildren = 5;
  } else {
    maxDepth = 6;
    maxChildren = 12;
    minChildren = 8;
  }
  
  // 生成树并检查节点数
  let tree = generateTreeData({
    rootName: `约${targetNodeCount}节点组织`,
    maxDepth,
    maxChildrenPerNode: maxChildren,
    minChildrenPerNode: minChildren
  });
  
  let nodeCount = countNodes(tree);
  
  // 如果节点数相差太大，尝试调整参数重新生成
  // 这里只做简单调整，实际应用可能需要更复杂的算法
  if (Math.abs(nodeCount - targetNodeCount) > targetNodeCount * 0.3) {
    if (nodeCount < targetNodeCount) {
      // 增加子节点数或深度
      maxChildren = Math.min(maxChildren + 2, 15);
      minChildren = Math.min(minChildren + 1, maxChildren - 1);
    } else {
      // 减少子节点数或深度
      maxChildren = Math.max(maxChildren - 2, minChildren + 1);
      minChildren = Math.max(minChildren - 1, 1);
    }
    
    tree = generateTreeData({
      rootName: `约${targetNodeCount}节点组织`,
      maxDepth,
      maxChildrenPerNode: maxChildren,
      minChildrenPerNode: minChildren
    });
  }
  
  return tree;
};

export default {
  generateTreeData,
  generateSmallTree,
  generateMediumTree,
  generateLargeTree,
  generateHugeTree,
  generateTreeWithNodeCount,
  countNodes
};

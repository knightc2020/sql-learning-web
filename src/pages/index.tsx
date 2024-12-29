import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import SQLEditor from '../components/SQLEditor';
import ResultPanel from '../components/ResultPanel';

// 课程内容类型定义
interface CourseContent {
  title: string;
  description: string;
  content?: string[];
  examples: Array<{
    title: string;
    description: string;
    sql: string;
  }>;
}

// 课程内容数据
const courseContents: { [key: string]: CourseContent } = {
  // 1. SQL基础知识
  'db-basics': {
    title: '数据库基本概念',
    description: '关系型数据库是目前最常用的数据库类型之一。在开始学习SQL之前，让我们先了解一些基本概念。',
    content: [
      '• 表（Table）：存储数据的基本单位，由行和列组成',
      '• 字段（Field）：表中的列，定义数据的属性',
      '• 记录（Record）：表中的行，包含具体的数据内容',
      '• 主键（Primary Key）：唯一标识表中每条记录的字段',
      '• 外键（Foreign Key）：用于建立表之间关联的字段'
    ],
    examples: [
      {
        title: '查看表结构',
        description: '查看客户信息表的结构：',
        sql: 'SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH\nFROM INFORMATION_SCHEMA.COLUMNS\nWHERE TABLE_NAME = \'customers\';'
      },
      {
        title: '查看主键信息',
        description: '查看客户表的主键信息：',
        sql: 'SELECT KCU.COLUMN_NAME\nFROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC\nJOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU\nON TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME\nWHERE TC.TABLE_NAME = \'customers\'\nAND TC.CONSTRAINT_TYPE = \'PRIMARY KEY\';'
      }
    ]
  },
  'sql-intro': {
    title: 'SQL语言简介',
    description: 'SQL（结构化查询语言）是用于管理关系型数据库的标准语言。它包含多种类型的语句，用于数据查询和管理。',
    content: [
      '• DDL（数据定义语言）：CREATE, ALTER, DROP等',
      '• DML（数据操作语言）：SELECT, INSERT, UPDATE, DELETE等',
      '• DCL（数据控制语言）：GRANT, REVOKE等',
      '• TCL（事务控制语言）：COMMIT, ROLLBACK等'
    ],
    examples: [
      {
        title: '基本查询',
        description: '查询客户表中的所有数据：',
        sql: 'SELECT * FROM customers;'
      },
      {
        title: '指定字段查询',
        description: '查询客户的姓名和联系方式：',
        sql: 'SELECT customer_name, phone, email FROM customers;'
      }
    ]
  },
  // 2. 银行数据分析实战
  'customer-analysis': {
    title: '客户信息分析',
    description: '通过SQL分析银行客户数据，了解客户特征分布和行为模式。',
    content: [
      '• 客户基础信息分析',
      '• 客户分类和分层',
      '• 客户价值评估',
      '• 客户行为分析'
    ],
    examples: [
      {
        title: '年龄分布分析',
        description: '统计不同年龄段的客户数量：',
        sql: 'SELECT \n  CASE \n    WHEN age < 25 THEN \'25岁以下\'\n    WHEN age BETWEEN 25 AND 35 THEN \'25-35岁\'\n    WHEN age BETWEEN 36 AND 50 THEN \'36-50岁\'\n    ELSE \'50岁以上\'\n  END as age_group,\n  COUNT(*) as customer_count\nFROM customers\nGROUP BY age_group\nORDER BY age_group;'
      },
      {
        title: 'VIP客户分析',
        description: '分析高净值客户的资产分布：',
        sql: 'SELECT \n  customer_level,\n  COUNT(*) as customer_count,\n  AVG(total_assets) as avg_assets,\n  MAX(total_assets) as max_assets\nFROM customers\nWHERE customer_level = \'VIP\'\nGROUP BY customer_level;'
      }
    ]
  },
  'transaction-analysis': {
    title: '交易数据分析',
    description: '分析银行交易数据，识别交易模式和异常情况。',
    content: [
      '• 交易金额分析',
      '• 交易频次统计',
      '• 交易类型分布',
      '• 异常交易识别'
    ],
    examples: [
      {
        title: '日交易统计',
        description: '统计每日交易总额和笔数：',
        sql: 'SELECT \n  DATE(transaction_time) as trans_date,\n  COUNT(*) as trans_count,\n  SUM(amount) as total_amount\nFROM transactions\nGROUP BY trans_date\nORDER BY trans_date DESC\nLIMIT 7;'
      },
      {
        title: '大额交易监控',
        description: '查询大额交易记录：',
        sql: 'SELECT \n  t.transaction_id,\n  c.customer_name,\n  t.amount,\n  t.transaction_time,\n  t.transaction_type\nFROM transactions t\nJOIN customers c ON t.customer_id = c.customer_id\nWHERE t.amount >= 50000\nORDER BY t.amount DESC;'
      }
    ]
  },
  // 3. 高级查询技巧
  'advanced-joins': {
    title: '多表联接查询',
    description: '学习如何使用各种JOIN语句组合多个表的数据。',
    content: [
      '• INNER JOIN的使用场景',
      '• LEFT/RIGHT JOIN的区别',
      '• 多表联接的优化',
      '• 常见联接问题'
    ],
    examples: [
      {
        title: '客户交易统计',
        description: '统计每个客户的交易情况：',
        sql: 'SELECT \n  c.customer_name,\n  COUNT(t.transaction_id) as trans_count,\n  SUM(t.amount) as total_amount\nFROM customers c\nLEFT JOIN transactions t ON c.customer_id = t.customer_id\nGROUP BY c.customer_id, c.customer_name\nORDER BY total_amount DESC;'
      },
      {
        title: '产品持有分析',
        description: '分析客户产品持有情况：',
        sql: 'SELECT \n  c.customer_name,\n  p.product_name,\n  h.purchase_date,\n  h.holding_amount\nFROM customers c\nINNER JOIN holdings h ON c.customer_id = h.customer_id\nINNER JOIN products p ON h.product_id = p.product_id\nWHERE h.holding_amount > 10000;'
      }
    ]
  },
  'window-functions': {
    title: '窗口函数应用',
    description: '使用窗口函数进行高级数据分析和计算。',
    content: [
      '• 排序函数使用',
      '• 分组统计计算',
      '• 移动平均计算',
      '• 同比环比分析'
    ],
    examples: [
      {
        title: '客户资产排名',
        description: '计算客户资产排名：',
        sql: 'SELECT \n  customer_name,\n  total_assets,\n  RANK() OVER (ORDER BY total_assets DESC) as asset_rank,\n  DENSE_RANK() OVER (ORDER BY total_assets DESC) as dense_rank\nFROM customers\nWHERE total_assets > 0;'
      },
      {
        title: '交易金额环比',
        description: '计算每月交易金额环比变化：',
        sql: 'WITH monthly_stats AS (\n  SELECT \n    DATE_TRUNC(\'month\', transaction_time) as month,\n    SUM(amount) as total_amount\n  FROM transactions\n  GROUP BY month\n)\nSELECT \n  month,\n  total_amount,\n  LAG(total_amount) OVER (ORDER BY month) as prev_month_amount,\n  (total_amount - LAG(total_amount) OVER (ORDER BY month)) / \n    LAG(total_amount) OVER (ORDER BY month) * 100 as mom_change\nFROM monthly_stats\nORDER BY month DESC;'
      }
    ]
  },
  // 4. 数据质量控制
  'data-validation': {
    title: '数据完整性检查',
    description: '确保数据的准确性、完整性和一致性是数据分析的基础。本节介绍如何使用SQL进行数据质量控制。',
    content: [
      '• 数据完整性类型：实体完整性、参照完整性、域完整性',
      '• 数据验证方法：格式检查、范围验证、逻辑验证',
      '• 数据清洗流程：识别、分析、处理、验证',
      '• 质量监控指标：准确率、完整率、一致率'
    ],
    examples: [
      {
        title: '空值检查',
        description: '检查客户表中的空值情况：',
        sql: 'SELECT \n  column_name,\n  COUNT(*) as total_rows,\n  COUNT(*) - COUNT(column_name) as null_count,\n  ROUND(((COUNT(*) - COUNT(column_name))::float / COUNT(*) * 100), 2) as null_percentage\nFROM (\n  SELECT * FROM customers\n) t\nCROSS JOIN (\n  SELECT column_name\n  FROM information_schema.columns\n  WHERE table_name = \'customers\'\n) cols\nGROUP BY column_name\nHAVING COUNT(*) - COUNT(column_name) > 0\nORDER BY null_percentage DESC;'
      },
      {
        title: '数据一致性检查',
        description: '检查交易金额与余额变动是否一致：',
        sql: 'SELECT \n  t.transaction_id,\n  t.amount as trans_amount,\n  b.balance_change,\n  t.amount - b.balance_change as difference\nFROM transactions t\nJOIN balance_history b ON t.transaction_id = b.transaction_id\nWHERE ABS(t.amount - b.balance_change) > 0.01;'
      }
    ]
  },
  'data-cleaning': {
    title: '数据清洗处理',
    description: '学习如何处理重复数据、异常值和不一致数据，确保数据分析的准确性。',
    content: [
      '• 重复数据处理：识别和删除重复记录',
      '• 异常值处理：识别和处理离群值',
      '• 数据标准化：统一数据格式和单位',
      '• 数据修复：填充缺失值、更正错误值'
    ],
    examples: [
      {
        title: '重复记录检测',
        description: '查找重复的交易记录：',
        sql: 'WITH duplicate_check AS (\n  SELECT \n    customer_id,\n    amount,\n    transaction_time,\n    COUNT(*) as occurrence_count\n  FROM transactions\n  GROUP BY customer_id, amount, transaction_time\n  HAVING COUNT(*) > 1\n)\nSELECT \n  t.*,\n  c.customer_name\nFROM transactions t\nJOIN customers c ON t.customer_id = c.customer_id\nWHERE EXISTS (\n  SELECT 1 FROM duplicate_check d\n  WHERE t.customer_id = d.customer_id\n  AND t.amount = d.amount\n  AND t.transaction_time = d.transaction_time\n)\nORDER BY t.customer_id, t.transaction_time;'
      },
      {
        title: '异常值检测',
        description: '使用统计方法识别异常交易：',
        sql: 'WITH stats AS (\n  SELECT\n    AVG(amount) as avg_amount,\n    STDDEV(amount) as stddev_amount\n  FROM transactions\n)\nSELECT \n  t.transaction_id,\n  c.customer_name,\n  t.amount,\n  t.transaction_time,\n  (t.amount - stats.avg_amount) / stats.stddev_amount as z_score\nFROM transactions t\nJOIN customers c ON t.customer_id = c.customer_id\nCROSS JOIN stats\nWHERE ABS((t.amount - stats.avg_amount) / stats.stddev_amount) > 3\nORDER BY ABS((t.amount - stats.avg_amount) / stats.stddev_amount) DESC;'
      }
    ]
  },
  // 5. 常用分析场景
  'business-reporting': {
    title: '业务报表分析',
    description: '掌握银行常用业务报表的SQL分析方法，包括业务量统计、收入分析等。',
    content: [
      '• 日常业务报表：交易量、开户数、产品销售等',
      '• 业绩分析报表：收入构成、增长趋势等',
      '• 客户分析报表：客户画像、行为特征等',
      '• 风险监控报表：逾期率、坏账率等'
    ],
    examples: [
      {
        title: '月度业务报表',
        description: '生成月度业务概况报表：',
        sql: 'WITH monthly_stats AS (\n  SELECT \n    DATE_TRUNC(\'month\', transaction_time) as month,\n    COUNT(DISTINCT customer_id) as active_customers,\n    COUNT(*) as transaction_count,\n    SUM(amount) as total_amount\n  FROM transactions\n  WHERE transaction_time >= CURRENT_DATE - INTERVAL \'12 months\'\n  GROUP BY DATE_TRUNC(\'month\', transaction_time)\n)\nSELECT \n  month,\n  active_customers,\n  transaction_count,\n  total_amount,\n  total_amount / transaction_count as avg_transaction_amount,\n  transaction_count / active_customers as avg_transactions_per_customer\nFROM monthly_stats\nORDER BY month DESC;'
      },
      {
        title: '产品销售分析',
        description: '分析各产品的销售情况：',
        sql: 'SELECT \n  p.product_type,\n  COUNT(DISTINCT s.customer_id) as customer_count,\n  COUNT(*) as sale_count,\n  SUM(s.amount) as total_sales,\n  AVG(s.amount) as avg_sale_amount,\n  MIN(s.amount) as min_sale_amount,\n  MAX(s.amount) as max_sale_amount\nFROM product_sales s\nJOIN products p ON s.product_id = p.product_id\nWHERE s.sale_date >= CURRENT_DATE - INTERVAL \'30 days\'\nGROUP BY p.product_type\nORDER BY total_sales DESC;'
      }
    ]
  },
  'risk-monitoring': {
    title: '风险监控分析',
    description: '学习如何使用SQL进行风险监控和预警，包括信用风险、操作风险等。',
    content: [
      '• 信用风险监控：逾期监控、额度管理等',
      '• 操作风险分析：异常操作、权限违规等',
      '• 市场风险评估：价格波动、持仓分析等',
      '• 流动性风险：资金流动性、期限错配等'
    ],
    examples: [
      {
        title: '逾期风险分析',
        description: '分析贷款逾期情况：',
        sql: 'SELECT \n  loan_type,\n  COUNT(*) as total_loans,\n  COUNT(CASE WHEN overdue_days > 0 THEN 1 END) as overdue_loans,\n  ROUND(COUNT(CASE WHEN overdue_days > 0 THEN 1 END)::float / COUNT(*) * 100, 2) as overdue_rate,\n  AVG(CASE WHEN overdue_days > 0 THEN overdue_days END) as avg_overdue_days,\n  SUM(CASE WHEN overdue_days > 0 THEN outstanding_amount END) as overdue_amount\nFROM loan_accounts\nGROUP BY loan_type\nORDER BY overdue_rate DESC;'
      },
      {
        title: '异常操作监控',
        description: '检测可疑的操作行为：',
        sql: 'SELECT \n  o.operator_id,\n  e.employee_name,\n  COUNT(*) as operation_count,\n  COUNT(DISTINCT o.customer_id) as affected_customers,\n  STRING_AGG(DISTINCT o.operation_type, \', \') as operation_types\nFROM operations o\nJOIN employees e ON o.operator_id = e.employee_id\nWHERE o.operation_time >= CURRENT_TIMESTAMP - INTERVAL \'1 hour\'\nGROUP BY o.operator_id, e.employee_name\nHAVING COUNT(*) > 100 OR COUNT(DISTINCT o.customer_id) > 50;'
      }
    ]
  },
  // 6. 最佳实践
  'query-optimization': {
    title: '查询优化技巧',
    description: '学习SQL查询优化的方法和技巧，提高查询效率和性能。',
    content: [
      '• 索引使用优化：合理使用索引、避免索引失效',
      '• 查询重写技巧：简化查询逻辑、减少子查询',
      '• 性能调优方法：执行计划分析、资源利用优化',
      '• 大数据量处理：分批处理、游标使用'
    ],
    examples: [
      {
        title: '索引使用分析',
        description: '查看查询的索引使用情况：',
        sql: 'EXPLAIN ANALYZE\nSELECT \n  c.customer_name,\n  COUNT(*) as transaction_count,\n  SUM(t.amount) as total_amount\nFROM customers c\nJOIN transactions t ON c.customer_id = t.customer_id\nWHERE t.transaction_time >= CURRENT_DATE - INTERVAL \'30 days\'\nGROUP BY c.customer_id, c.customer_name\nHAVING COUNT(*) > 10\nORDER BY total_amount DESC;'
      },
      {
        title: '查询重写优化',
        description: '优化复杂查询的示例：',
        sql: '/* 优化前的查询 */\nWITH customer_stats AS (\n  SELECT customer_id, COUNT(*) as trans_count\n  FROM transactions\n  GROUP BY customer_id\n)\nSELECT *\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM customer_stats s\n  WHERE c.customer_id = s.customer_id\n  AND s.trans_count > 100\n);\n\n/* 优化后的查询 */\nSELECT c.*\nFROM customers c\nJOIN (\n  SELECT customer_id\n  FROM transactions\n  GROUP BY customer_id\n  HAVING COUNT(*) > 100\n) t ON c.customer_id = t.customer_id;'
      }
    ]
  },
  'security-practice': {
    title: '安全性最佳实践',
    description: '了解SQL开发中的安全注意事项，防范SQL注入等安全风险。',
    content: [
      '• SQL注入防范：参数化查询、输入验证',
      '• 权限管理：最小权限原则、角色分配',
      '• 敏感数据保护：数据脱敏、加密处理',
      '• 审计日志：操作记录、异常监控'
    ],
    examples: [
      {
        title: '安全的参数化查询',
        description: '使用参数化查询防止SQL注入：',
        sql: '/* 不安全的查询示例 */\n-- 假设用户输入: username = "admin\' --" 和 password = "anything"\n-- SELECT * FROM customers WHERE username = \'admin\' --\' AND password = \'anything\';\n\n/* 安全的参数化查询示例 */\nPREPARE user_query (text, text) AS\nSELECT customer_id, customer_name, email\nFROM customers\nWHERE username = $1 AND password_hash = crypt($2, password_hash);'
      },
      {
        title: '数据脱敏查询',
        description: '查询时对敏感信息进行脱敏：',
        sql: 'SELECT \n  customer_id,\n  CONCAT(SUBSTRING(customer_name, 1, 1), \'***\', SUBSTRING(customer_name, -1, 1)) as masked_name,\n  CONCAT(\'****\', RIGHT(phone_number, 4)) as masked_phone,\n  CONCAT(SUBSTRING(email, 1, 2), \'***\', SUBSTRING(email, POSITION(\'@\' IN email))) as masked_email\nFROM customers\nWHERE customer_level = \'VIP\';'
      }
    ]
  }
};

export default function Home() {
  const router = useRouter();
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState('db-basics');
  const [expandedSections, setExpandedSections] = useState<string[]>(['section-1']);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSectionClick = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleTopicClick = (topicId: string) => {
    setCurrentSection(topicId);
  };

  const handleRunExample = (sql: string) => {
    handleExecuteQuery(sql);
  };

  const handleExecuteQuery = async (sql: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/execute-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sql,
          token
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.columns) {
        setColumns(
          data.columns.map((col: string) => ({
            Header: col,
            accessor: col,
          }))
        );
      }
      
      setQueryResult(data.rows || []);
    } catch (error: any) {
      console.error('查询执行失败:', error);
      setError(error.message || '查询执行失败');
      setQueryResult([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex">
        {/* 左侧边栏 */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">课程大纲</h2>
            <nav className="space-y-1">
              {/* SQL基础知识 */}
              <div className="bg-blue-50 rounded-md">
                <button 
                  onClick={() => handleSectionClick('section-1')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-md flex items-center"
                >
                  <span className="mr-2">{expandedSections.includes('section-1') ? '▼' : '▶'}</span>
                  1. SQL基础知识
                </button>
                {expandedSections.includes('section-1') && (
                  <div className="pl-8 py-2 space-y-1">
                    <button 
                      onClick={() => handleTopicClick('db-basics')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'db-basics' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      数据库基本概念
                    </button>
                    <button 
                      onClick={() => handleTopicClick('sql-intro')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'sql-intro' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      SQL语言简介
                    </button>
                  </div>
                )}
              </div>
              
              {/* 银行数据分析实战 */}
              <div className="rounded-md">
                <button 
                  onClick={() => handleSectionClick('section-2')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center"
                >
                  <span className="mr-2">{expandedSections.includes('section-2') ? '▼' : '▶'}</span>
                  2. 银行数据分析实战
                </button>
                {expandedSections.includes('section-2') && (
                  <div className="pl-8 py-2 space-y-1">
                    <button 
                      onClick={() => handleTopicClick('customer-analysis')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'customer-analysis' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      客户信息分析
                    </button>
                    <button 
                      onClick={() => handleTopicClick('transaction-analysis')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'transaction-analysis' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      交易数据分析
                    </button>
                  </div>
                )}
              </div>
              
              {/* 高级查询技巧 */}
              <div className="rounded-md">
                <button 
                  onClick={() => handleSectionClick('section-3')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center"
                >
                  <span className="mr-2">{expandedSections.includes('section-3') ? '▼' : '▶'}</span>
                  3. 高级查询技巧
                </button>
                {expandedSections.includes('section-3') && (
                  <div className="pl-8 py-2 space-y-1">
                    <button 
                      onClick={() => handleTopicClick('advanced-joins')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'advanced-joins' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      多表联接查询
                    </button>
                    <button 
                      onClick={() => handleTopicClick('window-functions')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'window-functions' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      窗口函数应用
                    </button>
                  </div>
                )}
              </div>
              
              {/* 数据质量控制 */}
              <div className="rounded-md">
                <button 
                  onClick={() => handleSectionClick('section-4')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center"
                >
                  <span className="mr-2">{expandedSections.includes('section-4') ? '▼' : '▶'}</span>
                  4. 数据质量控制
                </button>
                {expandedSections.includes('section-4') && (
                  <div className="pl-8 py-2 space-y-1">
                    <button 
                      onClick={() => handleTopicClick('data-validation')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'data-validation' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      数据完整性检查
                    </button>
                    <button 
                      onClick={() => handleTopicClick('data-cleaning')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'data-cleaning' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      数据清洗处理
                    </button>
                  </div>
                )}
              </div>
              
              {/* 常用分析场景 */}
              <div className="rounded-md">
                <button 
                  onClick={() => handleSectionClick('section-5')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center"
                >
                  <span className="mr-2">{expandedSections.includes('section-5') ? '▼' : '▶'}</span>
                  5. 常用分析场景
                </button>
                {expandedSections.includes('section-5') && (
                  <div className="pl-8 py-2 space-y-1">
                    <button 
                      onClick={() => handleTopicClick('business-reporting')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'business-reporting' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      业务报表分析
                    </button>
                    <button 
                      onClick={() => handleTopicClick('risk-monitoring')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'risk-monitoring' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      风险监控分析
                    </button>
                  </div>
                )}
              </div>
              
              {/* 最佳实践 */}
              <div className="rounded-md">
                <button 
                  onClick={() => handleSectionClick('section-6')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center"
                >
                  <span className="mr-2">{expandedSections.includes('section-6') ? '▼' : '▶'}</span>
                  6. 最佳实践
                </button>
                {expandedSections.includes('section-6') && (
                  <div className="pl-8 py-2 space-y-1">
                    <button 
                      onClick={() => handleTopicClick('query-optimization')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'query-optimization' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      查询优化技巧
                    </button>
                    <button 
                      onClick={() => handleTopicClick('security-practice')}
                      className={`w-full text-left px-4 py-1 text-xs font-medium ${
                        currentSection === 'security-practice' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      安全性最佳实践
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* 主要内容区 */}
        <div className="flex-1 ml-8">
          {/* 课程内容展示区 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900">{courseContents[currentSection].title}</h2>
            <div className="mt-4">
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  {courseContents[currentSection].description}
                </p>
                {courseContents[currentSection].content && (
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">知识要点</h3>
                    <ul className="space-y-2">
                      {courseContents[currentSection].content.map((item, index) => (
                        <li key={index} className="text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">练习示例</h4>
                {courseContents[currentSection].examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">{example.title}</h5>
                    <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                    <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
                      <code>{example.sql}</code>
                    </pre>
                    <div className="mt-3 flex space-x-3">
                      <button 
                        onClick={() => handleRunExample(example.sql)}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                      >
                        运行示例
                      </button>
                      <button 
                        onClick={() => {
                          const editor = document.querySelector('textarea');
                          if (editor) {
                            editor.value = example.sql;
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                      >
                        复制到编辑器
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900">SQL编辑器</h2>
            <p className="mt-2 text-gray-600">在这里编写和执行SQL查询语句</p>
            
            <div className="mt-4 space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                查看客户表
              </button>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                查看交易表
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <SQLEditor onExecute={handleExecuteQuery} />
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ResultPanel
                data={queryResult}
                columns={columns}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
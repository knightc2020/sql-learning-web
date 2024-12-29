import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  columns?: string[];
  rows?: any[];
  error?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { sql, token } = req.body;

    if (!sql) {
      return res.status(400).json({ error: 'SQL查询语句不能为空' });
    }

    if (!token) {
      return res.status(401).json({ error: '未提供认证token' });
    }

    // 格式化SQL语句
    const formattedSql = sql.trim();

    if (!API_URL) {
      throw new Error('后端API地址未配置，请检查环境变量 NEXT_PUBLIC_API_URL');
    }

    console.log('正在发送请求到:', `${API_URL}/api/sql/execute`);
    console.log('SQL查询:', formattedSql);

    // 使用环境变量中的API地址
    const response = await fetch(`${API_URL}/api/sql/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sql: formattedSql }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('后端响应错误:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`查询执行失败: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('后端响应数据:', data);

    if (!data.success) {
      throw new Error(data.message || '查询执行失败');
    }

    // 从后端响应中提取数据
    const result = data.data;
    if (Array.isArray(result)) {
      // 如果结果是数组，提取列名和数据
      const firstRow = result[0] || {};
      const columns = Object.keys(firstRow);
      res.status(200).json({
        columns,
        rows: result
      });
    } else {
      // 如果结果不是数组，直接返回
      res.status(200).json({
        columns: ['Result'],
        rows: [{ Result: JSON.stringify(result) }]
      });
    }
  } catch (error: any) {
    console.error('API错误:', error);
    res.status(500).json({ error: error.message || '服务器内部错误' });
  }
} 
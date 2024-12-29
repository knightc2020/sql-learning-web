import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import SQLEditor from '../components/SQLEditor';
import ResultPanel from '../components/ResultPanel';

export default function Home() {
  const router = useRouter();
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleExecuteQuery = async (sql: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 获取认证token
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
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">SQL练习</h2>
            <p className="mt-1 text-sm text-gray-600">
              在下方编辑器中输入SQL查询语句，点击执行按钮查看结果。
            </p>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-16rem)]">
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
    </Layout>
  );
} 
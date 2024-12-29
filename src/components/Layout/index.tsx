import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-blue-600">SQL Learning Platform</h1>
              <p className="mt-1 text-lg text-gray-600">专业银行数据分析学习平台</p>
            </div>
            <div className="flex items-center space-x-8 py-4 border-t">
              <Link
                href="/learn"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  router.pathname === '/learn'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📚</span>
                学习
              </Link>
              <Link
                href="/"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  router.pathname === '/'
                    ? 'text-blue-600 bg-blue-50 rounded-md'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">&lt;/&gt;</span>
                实践
              </Link>
              <Link
                href="/data"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  router.pathname === '/data'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📊</span>
                数据
              </Link>
              <Link
                href="/help"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  router.pathname === '/help'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">❓</span>
                帮助
              </Link>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="ml-auto px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  退出登录
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 
import React from 'react';
import Layout from '../components/Layout';

export default function Learn() {
  return (
    <Layout>
      <div className="flex">
        {/* 左侧课程导航 */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">课程大纲</h2>
            <nav className="space-y-1">
              <div className="bg-blue-50 rounded-md">
                <button className="w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-md flex items-center">
                  <span className="mr-2">▼</span>
                  SQL基础与银行数据库入门
                </button>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                数据过滤与排序
              </button>
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                多表联接操作
              </button>
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                数据统计与汇总
              </button>
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                进阶应用与实战演练
              </button>
            </nav>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 ml-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">SQL基础与银行数据库入门</h1>
            <p className="text-gray-600 mb-8">了解SQL基础知识和银行数据库结构</p>

            {/* 学习目标 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">学习目标</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">1</span>
                  <span className="text-gray-700">理解SQL在银行数据分析中的应用</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">2</span>
                  <span className="text-gray-700">掌握基本SQL语句：SELECT, FROM, WHERE</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">3</span>
                  <span className="text-gray-700">熟悉银行数据库架构</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">4</span>
                  <span className="text-gray-700">掌握数据类型和字段规范</span>
                </div>
              </div>
            </div>

            {/* 课程内容 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">课程内容</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-3">
                    <a href="#" className="hover:underline">SQL概述及其在银行业的应用</a>
                  </h3>
                  <ul className="space-y-2 text-gray-600 ml-5">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <div>
                        <strong className="text-gray-900">SQL在银行业务中的重要性</strong>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>- 客户信息管理：查询和分析客户基本信息</li>
                          <li>- 交易分析：统计和监控交易数据</li>
                          <li>- 风险评估：分析客户信用和交易模式</li>
                          <li>- 业务报表：生成日常运营报表</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start mt-4">
                      <span className="mr-2">•</span>
                      <div>
                        <strong className="text-gray-900">常见分析场景</strong>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>- 客户画像分析：了解客户的交易习惯和产品偏好</li>
                          <li>- 交易趋势分析：分析不同时期的交易变化</li>
                          <li>- 产品性能分析：评估不同银行产品的表现</li>
                          <li>- 风险监控：识别异常交易和风险行为</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
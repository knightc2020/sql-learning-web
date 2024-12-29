import React from 'react';
import { Column, useTable, usePagination, TableInstance } from 'react-table';

interface ResultPanelProps {
  data: any[];
  columns: Column<any>[];
  isLoading?: boolean;
}

type TableInstanceWithPagination = TableInstance<any> & {
  page: any[];
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
  state: {
    pageIndex: number;
    pageSize: number;
  };
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  data = [],
  columns = [],
  isLoading = false,
}) => {
  const instance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 } as any,
    },
    usePagination
  ) as TableInstanceWithPagination;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = instance;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-white">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
            <div className="animate-spin w-5 h-5 border-b-2 border-blue-600 rounded-full mr-3"></div>
            <span className="text-sm text-blue-600 font-medium">查询执行中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-white text-center px-4">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">暂无查询结果</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            请在编辑器中输入SQL查询语句并执行。例如：<br/>
            <code className="px-2 py-1 bg-gray-50 rounded text-blue-600 mt-2 inline-block">SELECT * FROM transaction_history</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">查询结果</h3>
          <p className="mt-1 text-sm text-gray-500">共 {data.length} 条记录</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50 transition-colors">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上一页
          </button>
          <span className="text-sm text-gray-700">
            第 <span className="font-medium">{pageIndex + 1}</span> 页，
            共 <span className="font-medium">{pageOptions.length}</span> 页
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultPanel; 
import React from 'react';
import Pagination from './Pagination';

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

function DataTable<T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  emptyMessage = "No hay datos disponibles.",
  pagination
}: Props<T>) {
  return (
    <div className="bg-white shadow ring-1 ring-gray-200 sm:rounded-lg overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Cargando información...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && !loading && data.length > 0 && (
        <Pagination {...pagination} />
      )}
    </div>
  );
}

export default DataTable;

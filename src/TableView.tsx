import { FC, useEffect, useMemo, useState } from "react";
import { Database } from "sql.js";
import {
  createTable,
  PaginationState,
  useTableInstance,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Pagination from "./Pagination";

export type TableRow = { columns: string[]; values: any[] };

export type ConvertedRow = Record<string, unknown>;

type Props = {
  columns: string[];
  results: ConvertedRow[];
};

const tableGlobal = createTable();

const TableView: FC<Props> = ({ columns, results }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableColumns = useMemo(() => {
    return columns.map((col) =>
      tableGlobal.createDataColumn((row: any) => row[col], { id: col })
    );
  }, [results]);

  const instance = useTableInstance(tableGlobal, {
    data: results as unknown[],
    columns: tableColumns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="inline-block min-w-full align-middle">
      <table className="min-w-full divide-y divide-gray-300 overflow-x-auto">
        <thead className="bg-gray-50">
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900"
                >
                  {header.isPlaceholder ? null : header.renderHeader()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {instance.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                  key={cell.id}
                >
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination instance={instance} />
    </div>
  );
};

export default TableView;

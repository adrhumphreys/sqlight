import type { FC } from "react";
import { Table } from "./sql/useIntrospectDb";

type Props = {
  tables: Table[];
  setSelectedTable: (table: string) => void;
};

const TableList: FC<Props> = ({ setSelectedTable, tables }) => {
  return (
    <div className="h-full">
      <ul className="divide-y divide-gray-200">
        {tables.map(({ name, type }) => (
          <li key={name + type} className="w-full">
            <button
              onClick={() => setSelectedTable(name)}
              className="relative bg-white py-5 w-full text-left px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
            >
              {name}
              <span className="ml-2 rounded bg-blue-200 px-1 py-0.5 text-xs">
                {type}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableList;

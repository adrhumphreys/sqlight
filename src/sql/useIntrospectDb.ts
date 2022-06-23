import { useState } from "react";
import { Database, ParamsObject } from "sql.js";

export type Table = { name: string; type: string };

const useIntrospectDb = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const addTable = ({ name, type }: Table) =>
    setTables((tables) => tables.concat({ name, type }));

  const introspect = (db: Database) => {
    const tablesQuery = db.prepare(
      "SELECT * FROM sqlite_master WHERE type='table' OR type='view' ORDER BY name"
    );

    while (tablesQuery.step()) {
      var rowObj = tablesQuery.getAsObject();
      addTable({ name: rowObj.name as string, type: rowObj.type as string });
    }
  };

  return { introspect, tables };
};

export default useIntrospectDb;

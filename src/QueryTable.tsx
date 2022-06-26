import { FC, useEffect, useState } from "react";
import { Database } from "sql.js";
import Garden from "./Garden";
import Query from "./Query";
import { Schema } from "./sql/schema";
import TableView, { ConvertedRow } from "./TableView";
import convertTableRowToObject from "./util/convertTableRowToObject";

type Props = {
  db?: Database;
  schema?: Schema;
  selectedTable?: string;
};

const QueryTable: FC<Props> = ({ db, schema, selectedTable }) => {
  const [query, setQuery] = useState<string>(`SELECT * FROM ${selectedTable}`);
  const [results, setResults] = useState<ConvertedRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setQuery(`SELECT * FROM ${selectedTable}`);
  }, [selectedTable]);

  useEffect(() => {
    if (!query) return;
    setError(undefined);
    try {
      const r = db?.exec(query);
      if (!r || !r[0]) return;
      const converted = convertTableRowToObject(r[0]);
      setColumns(r[0]["columns"]);
      setResults(converted);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      console.error(e);
      return;
    }
  }, [query, db]);

  if (!db || !selectedTable || !schema) {
    return (
      <div className="grid place-content-center h-full gap-4">
        <Garden />
        <p className="text-xl text-center font-bold">Select a table/file</p>
      </div>
    );
  }

  const runQueryFn = (query: string) => setQuery(query);

  return (
    <div>
      <Query
        defaultQuery={query}
        error={error}
        runQueryFn={runQueryFn}
        schema={schema}
      />
      <div className="w-full overflow-x-auto">
        <TableView columns={columns} results={results} />
      </div>
    </div>
  );
};

export default QueryTable;

import initSqlJs, { Database } from "sql.js";

import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";
import { useEffect, useState } from "react";
import useIntrospectDb from "./useIntrospectDb";
import { Schema } from "./schema";

function readFileAsync(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}

const useDb = () => {
  const [db, setDb] = useState<Database | undefined>(undefined);
  const { tables, introspect } = useIntrospectDb();
  const [error, setError] = useState<any>(null);
  const [schema, setSchema] = useState<Schema | undefined>(undefined);

  // Disconnect the db when we're done with it
  useEffect(() => {
    return () => db?.close();
  }, []);

  // Handle a file upload creating the DB
  const handleFileUpload = async (file: any) => {
    const fileContent = await readFileAsync(file);
    if (!(fileContent instanceof ArrayBuffer)) {
      return;
    }

    try {
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      const db = new SQL.Database(new Uint8Array(fileContent));
      setDb(db);
      introspect(db);
      setSchema(await Schema.build(db));
    } catch (err) {
      setError(err);
    }
  };

  return { db, error, handleFileUpload, schema, tables };
};

export default useDb;

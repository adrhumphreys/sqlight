import { Database, QueryExecResult } from "sql.js";
import sqlSafeName from "../util/sqlSafeName";

export type Schema = Schema.DatabaseSchema;

export namespace Schema {
  export type Item = Database | Table | Column;

  export interface DatabaseSchema {
    tables: Schema.Table[];
  }

  export interface Table {
    name: string;
    type: string;
    columns: Schema.Column[];
  }

  export interface Column {
    table: string;
    name: string;
    type: string;
    notnull: boolean;
    pk: number;
    defVal: string;
    generatedAlways: boolean;
    virtual: boolean;
    stored: boolean;
  }

  export function build(db: Database): Promise<Schema.DatabaseSchema> {
    return new Promise((resolve, reject) => {
      let schema = {
        tables: [],
      } as Schema.DatabaseSchema;

      const tablesQuery = `SELECT name, type FROM sqlite_master
                                WHERE (type="table" OR type="view")
                                AND name <> 'sqlite_sequence'
                                AND name <> 'sqlite_stat1'
                                ORDER BY type ASC, name ASC;`;

      let results: QueryExecResult | undefined =
        db.exec(tablesQuery)[0] ?? undefined;

      if (!results || results === undefined) {
        reject(new Error("Empty database/or none provided"));
        return;
      }

      schema.tables = results.values.map((row) => {
        return { name: row[0], type: row[1], columns: [] } as Schema.Table;
      });

      const tryTableInfoPragma = async (tableInfoPragma: string) => {
        let ok = false;
        const promises = schema.tables.map(async (table) => {
          const columnQuery = `PRAGMA ${tableInfoPragma}(${sqlSafeName(
            table.name
          )});`;
          const result = db.exec(columnQuery)[0] ?? [];
          const rows = result.values;
          const header = result.columns;
          if (rows.length < 2) {
            return;
          }
          ok = true;
          //let tableName = result.stmt.replace(/.+\(\'?(\w+)\'?\).+/, '$1');
          table.columns = rows
            .filter((row) => {
              return row[header.indexOf("hidden")] !== "1";
            })
            .map((row) => {
              let type = "UNKNOWN";
              const typeI = row[header.indexOf("type")];
              if (typeof typeI === "string") {
                type = typeI.toUpperCase().replace(/ ?GENERATED ALWAYS$/, "");
              }
              const virtual = row[header.indexOf("hidden")] === "2";
              const stored = row[header.indexOf("hidden")] === "3";
              const generatedAlways =
                virtual || stored || / ?GENERATED ALWAYS$/.test(type);
              return {
                table: table.name,
                name: row[header.indexOf("name")],
                type,
                notnull: row[header.indexOf("notnull")] === "1" ? true : false,
                pk: Number(row[header.indexOf("pk")]) || 0,
                defVal: row[header.indexOf("dflt_value")],
                generatedAlways,
                virtual,
                stored,
              } as Schema.Column;
            });
        });
        await Promise.all(promises);
        return ok;
      };

      tryTableInfoPragma("table_xinfo")
        .then((ok) => {
          if (!ok) return tryTableInfoPragma("table_info");
        })
        .catch((err) => {
          console.error(err ? err.message || err : "unknown error");
        })
        .finally(() => resolve(schema));
    });
  }
}

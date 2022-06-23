import { languages } from "monaco-editor/esm/vs/editor/editor.api";
import uniqueBy from "../util/uniqueBy";
import { keywords } from "./keywords";
import { Schema } from "./schema";

type Range = {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
};

const getKeywordCompletionItems = (range: Range) => {
  return keywords.map((keyword) => ({
    label: keyword,
    kind: languages.CompletionItemKind.Function,
    documentation: "The Lodash library exported as Node.js modules.",
    insertText: keyword,
    range: range,
  }));
};

const getTableCompletionItems = (range: Range, tables: Schema.Table[]) => {
  return tables.map((table) => ({
    label: `${table.name} (${table.type})`,
    kind: languages.CompletionItemKind.Function,
    documentation: "The Lodash library exported as Node.js modules.",
    insertText: table.name,
    range: range,
  }));
};

const getColumnCompletionItems = (
  range: Range,
  columns: Schema.Column[] = [],
  noDuplicates: boolean = true
) => {
  let columnItems = columns.map((col) => ({
    label: `${col.name} (${col.type})`,
    kind: languages.CompletionItemKind.Function,
    documentation: "The Lodash library exported as Node.js modules.",
    insertText: col.name,
    range: range,
  }));

  if (noDuplicates) {
    columnItems = uniqueBy(columnItems, "label");
  }

  return columnItems;
};

const createCompletionItemProvider = (schema: Schema) => {
  const provideCompletionItems: languages.CompletionItemProvider["provideCompletionItems"] =
    (model, position, context, token) => {
      var word = model.getWordUntilPosition(position);
      var range: Range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      if (!schema) return { suggestions: getKeywordCompletionItems(range) };

      if (context.triggerCharacter === ".") {
        // when the trigger character is a dot we assume that we just need the columns
        let wordAtPosition = model.getWordAtPosition(position);
        const wordRange = { ...range, ...wordAtPosition };
        let tableName = model.getValueInRange({ ...range, ...wordAtPosition });
        let table = schema
          ? schema.tables.find((tbl) => tbl.name === tableName)
          : undefined;
        if (table) {
          return {
            suggestions: getColumnCompletionItems(wordRange, table.columns),
          };
        } else {
          return {
            suggestions: getColumnCompletionItems(
              wordRange,
              schema.tables.reduce(
                (acc, tbl) => acc.concat(tbl.columns),
                [] as Schema.Column[]
              )
            ),
          };
        }
      }

      const keywordItems = getKeywordCompletionItems(range);
      const tableItems = getTableCompletionItems(range, schema.tables);
      const columnItems = getColumnCompletionItems(
        range,
        schema.tables.reduce(
          (acc, tbl) => acc.concat(tbl.columns),
          [] as Schema.Column[]
        )
      );

      return {
        suggestions: [...keywordItems, ...tableItems, ...columnItems],
      };
    };

  return provideCompletionItems;
};

export default createCompletionItemProvider;

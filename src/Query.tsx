import { ChangeEventHandler, FC, useEffect, useState } from "react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import createCompletionItemProvider from "./sql/completionProvider";
import { Schema } from "./sql/schema";
import { KeyCode, KeyMod } from "monaco-editor";
import { format } from "prettier-sql";

type Props = {
  defaultQuery: string;
  error?: string;
  runQueryFn: (query: string) => void;
  schema: Schema;
};

const Query: FC<Props> = ({ defaultQuery, error, runQueryFn, schema }) => {
  const monaco = useMonaco();
  useEffect(() => {
    // do conditional chaining
    monaco?.languages?.registerCompletionItemProvider("sql", {
      provideCompletionItems: createCompletionItemProvider(schema),
    });
  }, [monaco]);

  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery(defaultQuery);
    monaco?.editor.getModels().forEach((m) => m.setValue(defaultQuery));
  }, [defaultQuery]);

  const handleQueryChange = (input: string | undefined) => {
    if (!input) return;
    setQuery(input);
  };
  const runQuery = () => runQueryFn(query);
  const makePretty = () => {
    const newInput = format(query);
    setQuery(newInput);
    monaco?.editor.getModels().forEach((m) => m.setValue(newInput));
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editor.addAction({
      id: "query-runner",
      label: "Run the query",
      keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
      run: (ed) => {
        // Can't rely on `query` value as it's not been set at this point
        const value = ed.getModel()?.getValue();
        if (!value) return;
        runQueryFn(value);
      },
    });
  };

  return (
    <div className="pt-2">
      <Editor
        height="200px"
        defaultLanguage="sql"
        onChange={handleQueryChange}
        defaultValue={query}
        onMount={handleEditorDidMount}
        options={{ minimap: { enabled: false } }}
      />
      <div className="flex items-center space-x-4 p-2 bg-gray-50 border-t border-b border-gray-300">
        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={makePretty}
          >
            Prettify
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={runQuery}
          >
            Run query
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default Query;

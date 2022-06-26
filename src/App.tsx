import { FC, useRef, useState } from "react";
import QueryTable from "./QueryTable";
import useDb from "./sql/useDb";
import TableList from "./TableList";

type Props = {};

const App: FC<Props> = ({}) => {
  const { handleFileUpload, db, error, schema, tables } = useDb();
  const [selectedTable, setSelectedTable] = useState<string | undefined>(
    undefined
  );
  const uploadRef = useRef<HTMLInputElement>(null);

  const readFileContents = async () => {
    if (!uploadRef || uploadRef.current?.files?.length === 0) {
      return;
    }

    const file = uploadRef.current?.files
      ? uploadRef.current.files[0]
      : undefined;
    await handleFileUpload(file);
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <aside className="relative h-full flex flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto">
        <h1 className="text-lg text-center pt-2 font-bold">SQLight 🤷‍♀️</h1>
        <div className="p-2 border-b border-gray-200">
          <label
            htmlFor="file_input"
            className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center"
          >
            <h2 className="text-xl font-medium text-gray-700 tracking-wide">
              Select/swap file
            </h2>
            <p className="mt-2 text-gray-500 tracking-wide">
              Drag & drop your file (DB, SQLITE).
            </p>
            <input
              id="file_input"
              ref={uploadRef}
              type="file"
              onChange={() => readFileContents()}
              className="hidden"
            />
          </label>
        </div>
        <TableList schema={schema} setSelectedTable={setSelectedTable} />
      </aside>
      <main className="flex-1 w-full relative z-0 overflow-y-auto focus:outline-none">
        <QueryTable db={db} schema={schema} selectedTable={selectedTable} />
      </main>
    </div>
  );
};

export default App;

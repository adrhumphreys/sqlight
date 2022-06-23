import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import type { TableInstance } from "@tanstack/react-table";
import classNames from "classnames";
import type { FC } from "react";
import getPaginationArray from "./util/getPaginationArray";

type Props = {
  instance: TableInstance<any>;
};

const Pagination: FC<Props> = ({ instance }) => {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {instance.getState().pagination.pageIndex *
                instance.getState().pagination.pageSize +
                1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {(instance.getState().pagination.pageIndex + 1) *
                instance.getState().pagination.pageSize}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {instance.getCoreRowModel()?.rows.length}
            </span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => instance.previousPage()}
              disabled={!instance.getCanPreviousPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {getPaginationArray(
              instance.getState().pagination.pageIndex,
              instance.getPageCount()
            ).map((i) => {
              if (typeof i === "string") {
                return (
                  <div
                    key={i}
                    className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    ...
                  </div>
                );
              }
              return (
                <button
                  className={classNames(
                    "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                    {
                      "z-10 bg-indigo-50 border-indigo-500 text-indigo-600":
                        instance.getState().pagination.pageIndex === i - 1,
                      "bg-white border-gray-300 text-gray-500 hover:bg-gray-50":
                        instance.getState().pagination.pageIndex !== i - 1,
                    }
                  )}
                  key={i}
                  onClick={() => instance.setPageIndex(i - 1)}
                >
                  {i}
                </button>
              );
            })}
            <button
              onClick={() => instance.nextPage()}
              disabled={!instance.getCanNextPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

import { TableRow } from "../TableView";

const convertTableRowToObject = (
  tableRow: TableRow
): Record<string, unknown>[] => {
  return tableRow.values.map((value) => {
    return value.reduce((prev: any, curr: string, index: number) => {
      prev[tableRow.columns[index]] = curr;
      return prev;
    }, {});
  });
};

export default convertTableRowToObject;

export default function uniqueBy<T>(arr: T[], prop: string): T[] {
  var seen: { [key: string]: boolean } = {};
  return arr.filter((item) => {
    let k = (item as any)[prop];
    return k && seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

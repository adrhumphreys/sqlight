import { keywords } from "../sql/keywords";

const keywordsSet = new Set(keywords);

const sqlSafeName = (name: string): string => {
  if (/^[A-Za-z_]\w*$/.test(name) && !keywordsSet.has(name.toUpperCase())) {
    return name;
  }
  return `\`${name.replace(/`/g, "``")}\``;
};

export default sqlSafeName;

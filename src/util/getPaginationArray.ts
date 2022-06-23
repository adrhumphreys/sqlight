const getRange = (start: number, end: number) => {
  return Array(end - start + 1)
    .fill()
    .map((v, i) => i + start);
};

const getPaginationArray = (
  current: number,
  length: number,
  delta = 4
): (number | string)[] => {
  const range = {
    start: Math.round(current - delta / 2),
    end: Math.round(current + delta / 2),
  };

  if (range.start - 1 === 1 || range.end + 1 === length) {
    range.start += 1;
    range.end += 1;
  }

  let pages: (number | string)[] =
    current > delta
      ? getRange(
          Math.min(range.start, length - delta),
          Math.min(range.end, length)
        )
      : getRange(1, Math.min(length, delta + 1));

  const withDots = (value: number, pair: (number | string)[]) =>
    pages.length + 1 !== length ? pair : [value];

  if (pages[0] !== 1) {
    pages = withDots(1, [1, "..."]).concat(pages);
  }

  if (pages[pages.length - 1] < length) {
    pages = pages.concat(withDots(length, ["...", length]));
  }

  return pages;
};

export default getPaginationArray;

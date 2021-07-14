export default (high: any, low: any, periods: number, start = 1): number => {
  const sliceHigh = high.slice(start, periods + 1);
  const sliceLow = low.slice(start, periods + 1);

  const highNumber = Math.max(...sliceHigh);
  const lowNumber = Math.min(...sliceLow);

  const result = (highNumber + lowNumber) / 2;

  return result;
};

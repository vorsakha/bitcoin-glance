export default (high, low, periods, start = 1) => {
  const sliceHigh = high.slice(start, periods + 1);
  const sliceLow = low.slice(start, periods + 1);

  const highNumber = Math.max(...sliceHigh);
  const lowNumber = Math.min(...sliceLow);

  return (highNumber + lowNumber) / 2;
};

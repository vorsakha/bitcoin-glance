const handleTimeFrame = (time: string): void => {
  const timeFrame = document.getElementById("time-frame");

  switch (time) {
    case "4h":
      timeFrame.innerText = "Short Term";
      break;
    case "1d":
      timeFrame.innerText = "Medium Term";
      break;
    case "1w":
      timeFrame.innerText = "Long Term";
      break;
    default:
      break;
  }
};

export default handleTimeFrame;

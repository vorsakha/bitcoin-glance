import { klines } from "../Api/binanceData";
import handleTimeFrame from "../utils/handleTimeFrame";
// import countdown from "./utils/countdown";
import getHL from "../utils/smaHighsLows";

// Ichimoku calculations start
const getChikou = async (
  close: string[],
  high: string[],
  low: string[],
  lengthOne: number,
  lengthTwo: number,
  lengthThree: number
): Promise<string> => {
  try {
    // Get data from api and Ichimoku
    const price: number = parseFloat(high[31]);
    const chikou: number = parseFloat(close[1]);
    let tenkan: number = getHL(high, low, lengthOne + 30, 31);
    let kijun: number = getHL(high, low, lengthTwo + 30, 31);
    let spanA: number =
      (getHL(high, low, lengthOne + 60, 61) +
        getHL(high, low, lengthTwo + 60, 61)) /
      2;
    let spanB: number = getHL(high, low, lengthThree + 60, 61);

    let result: string;

    // Chikou parameters
    if (
      chikou > price &&
      chikou > tenkan &&
      chikou > kijun &&
      chikou > spanA &&
      chikou > spanB
    ) {
      result = "BULL";
    } else if (
      chikou < price &&
      chikou < tenkan &&
      chikou < kijun &&
      chikou < spanA &&
      chikou < spanB
    ) {
      result = "BEAR";
    } else {
      result = "BAD";
    }

    // return Chikou state
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getIchimoku = async (
  data: { close: string[]; high: string[]; low: string[] },
  lengthOne = 20,
  lengthTwo = 60,
  lengthThree = 120
): Promise<{
  price: number;
  tenkan: number;
  kijun: number;
  spanAPast: number;
  spanBPast: number;
  spanAFuture: number;
  spanBFuture: number;
  chikou: string;
}> => {
  try {
    // Data from api
    const close: string[] = data.close;
    const high: string[] = data.high;
    const low: string[] = data.low;

    if (close.length < 240) {
      document.getElementById("alert").innerText =
        "Low available data, glances might not be as precise.";
    } else {
      document.getElementById("alert").innerText = "";
    }

    // Ichimoku calculations
    const tenkan: number = getHL(high, low, lengthOne);
    const kijun: number = getHL(high, low, lengthTwo);
    const spanA: number =
      (getHL(high, low, lengthOne + 30, 31) +
        getHL(high, low, lengthTwo + 30, 31)) /
      2;
    const spanB: number = getHL(high, low, lengthThree + 30, 31);
    const spanAFuture: number = (tenkan + kijun) / 2;
    const spanBFuture: number = getHL(high, low, lengthThree);
    const chikou: string = await getChikou(
      close,
      high,
      low,
      lengthOne,
      lengthTwo,
      lengthThree
    );

    // return ichi calculations
    return {
      price: parseFloat(close[1]),
      tenkan: tenkan,
      kijun: kijun,
      spanAPast: spanA,
      spanBPast: spanB,
      spanAFuture: spanAFuture,
      spanBFuture: spanBFuture,
      chikou: chikou,
    };
  } catch (error) {
    console.log(error);
  }
};
// Ichimoku calculations end

// Glance status from ichimoku analysis
const getSignal = async (
  symbol: string,
  limit: number,
  interval: string
): Promise<{
  bull: boolean;
  bear: boolean;
}> => {
  try {
    // data
    const data: {
      high: string[];
      low: string[];
      close: string[];
    } = await klines(symbol, limit, interval);

    const kumo = await getIchimoku(data);

    // Signal parameters
    const bullish =
      kumo.tenkan > kumo.kijun &&
      kumo.spanAFuture > kumo.spanBFuture &&
      kumo.price > kumo.spanAPast &&
      kumo.price > kumo.spanBPast &&
      kumo.chikou === "BULL";

    const bearish =
      kumo.tenkan < kumo.kijun &&
      kumo.price < kumo.spanBPast &&
      kumo.price < kumo.spanAPast &&
      kumo.chikou === "BEAR";

    // Return parameters results
    return {
      bull: bullish,
      bear: bearish,
    };
  } catch (error) {
    console.log(error);
  }
};

// Export glance to html
export const handleSignal = async (interval: string): Promise<void> => {
  const glanceBRL = document.getElementById("glance-brl");
  const glanceUSD = document.getElementById("glance-usd");
  const signalElement = document.getElementById(`signal-${interval}`);
  document.getElementById(`signal-4h`).classList.remove("active");
  document.getElementById(`signal-1d`).classList.remove("active");
  document.getElementById(`signal-1w`).classList.remove("active");

  signalElement.classList.add("active");
  document.getElementById("alert").innerText = "";

  // Print time frame by passing the value
  handleTimeFrame(interval);
  //

  if (glanceBRL) {
    // Set timer
    glanceBRL.innerHTML = `<span class="loading">loading...</span>`;
    // Get signal
    const signal = await getSignal("btcbrl", 120 * 2, interval);

    // Edit HTML
    glanceBRL.innerHTML = `
        ${
          signal.bull
            ? `<span class="success ubuntu text-xl">Bullish Trend</span>`
            : ""
        }
        ${
          signal.bear
            ? `<span class="danger ubuntu text-xl">Bearish Trend</span>`
            : ""
        }
        ${
          !signal.bear && !signal.bull
            ? `<span class="price">Neutral Trend</span>`
            : ""
        }
      `;
  }

  if (glanceUSD) {
    // Set timer
    glanceUSD.innerHTML = `<span class="loading">loading...</span>`;
    // Get signal
    const signal = await getSignal("btcusdt", 120 * 2, interval);

    // Edit HTML
    glanceUSD.innerHTML = `
        ${
          signal.bull
            ? `<span class="success ubuntu text-xl">Bullish Trend</span>`
            : ""
        }
        ${
          signal.bear
            ? `<span class="danger ubuntu text-xl">Bearish Trend</span>`
            : ""
        }
        ${
          !signal.bear && !signal.bull
            ? `<span class="price">Neutral Trend</span>`
            : ""
        }
      `;
  }
};

import { klines } from "../Api/binanceData";
// import countdown from "./utils/countdown";
import getHL from "../utils/smaHighsLows";

// Ichimoku calculations start
const getChikou = async (
  close,
  high,
  low,
  lengthOne,
  lengthTwo,
  lengthThree
) => {
  try {
    // Get data from api and Ichimoku
    const price = parseFloat(high[31]);
    const chikou = parseFloat(close[1]);
    let tenkan = parseFloat(getHL(high, low, lengthOne + 30, 31));
    let kijun = parseFloat(getHL(high, low, lengthTwo + 30, 31));
    let spanA = parseFloat(
      (getHL(high, low, lengthOne + 60, 61) +
        getHL(high, low, lengthTwo + 60, 61)) /
        2
    );
    let spanB = parseFloat(getHL(high, low, lengthThree + 60, 61));

    let result;

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
  data,
  lengthOne = 20,
  lengthTwo = 60,
  lengthThree = 120
) => {
  try {
    // Data from api
    const close = data.close;
    const high = data.high;
    const low = data.low;

    if (close.length < 240) {
      document.getElementById("alert").innerText =
        "Low available data, glances might not be as precise.";
    } else {
      document.getElementById("alert").innerText = "";
    }

    // Ichimoku calculations
    const tenkan = getHL(high, low, lengthOne);
    const kijun = getHL(high, low, lengthTwo);
    const spanA =
      (getHL(high, low, lengthOne + 30, 31) +
        getHL(high, low, lengthTwo + 30, 31)) /
      2;
    const spanB = getHL(high, low, lengthThree + 30, 31);
    const spanAFuture = (tenkan + kijun) / 2;
    const spanBFuture = getHL(high, low, lengthThree);
    const chikou = await getChikou(
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
const getSignal = async (symbol, limit, interval) => {
  try {
    // data
    const data = await klines(symbol, limit, interval);

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
export const handleSignal = async (interval) => {
  const glanceBRL = document.getElementById("glance-brl");
  const glanceUSD = document.getElementById("glance-usd");
  const timeFrame = document.getElementById("time-frame");
  document.getElementById("alert").innerText = "";

  timeFrame.innerText = interval.toUpperCase();

  if (glanceBRL) {
    // Set timer
    glanceBRL.innerHTML = `<span class="loading">loading...</span>`;
    // Get signal
    const signal = await getSignal("btcbrl", 120 * 2, interval);

    // Edit HTML
    glanceBRL.innerHTML = `
        ${
          signal.bull ? `<span class="success ubuntu">Bullish Trend</span>` : ""
        }
        ${signal.bear ? `<span class="danger ubuntu">Bearish Trend</span>` : ""}
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
          signal.bull ? `<span class="success ubuntu">Bullish Trend</span>` : ""
        }
        ${signal.bear ? `<span class="danger ubuntu">Bearish Trend</span>` : ""}
        ${
          !signal.bear && !signal.bull
            ? `<span class="price">Neutral Trend</span>`
            : ""
        }
      `;
  }
};

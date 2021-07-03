import { klines } from "../Api/binanceData";
import countdown from "./utils/countdown";
import getHL from "./utils/smaHighsLows";

const getChikou = async (
  close,
  high,
  low,
  lengthOne,
  lengthTwo,
  lengthThree
) => {
  try {
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
    const close = data.close;
    const high = data.high;
    const low = data.low;

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

const getSignal = async (symbol) => {
  try {
    const data = await klines(symbol);
    const kumo = await getIchimoku(data);

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

    return {
      bull: bullish,
      bear: bearish,
    };
  } catch (error) {
    console.log(error);
  }
};

export const handleSignal = () => {
  const glanceBRL = document.getElementById("glance-brl");
  const glanceUSD = document.getElementById("glance-usd");
  const btn = document.getElementById("signal-btn");
  const timerElement = document.getElementById("timer");

  if (glanceBRL) {
    countdown(60 * 5, timerElement);
    const signal = getSignal("btcbrl");
    btn.disabled = true;
    glanceBRL.innerHTML = `
        ${signal.bull ? `<span class="success">Bullish Trend</span>` : ""}
        ${signal.bear ? `<span class="danger">Bearish Trend</span>` : ""}
        ${
          !signal.bear && !signal.bull
            ? `<span class="price">Neutral Trend</span>`
            : ""
        }
      `;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerText = `Get A Glance`;
      timerElement.innerText = "";
    }, 300000);
  }

  if (glanceUSD) {
    countdown(60 * 5, timerElement);
    const signal = getSignal("btcusdt");
    btn.disabled = true;
    glanceUSD.innerHTML = `
        ${signal.bull ? `<span class="success">Bullish Trend</span>` : ""}
        ${signal.bear ? `<span class="danger">Bearish Trend</span>` : ""}
        ${
          !signal.bear && !signal.bull
            ? `<span class="price">Neutral Trend</span>`
            : ""
        }
      `;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerText = `Get A Glance`;
      timerElement.innerText = "";
    }, 300000);
  }
};

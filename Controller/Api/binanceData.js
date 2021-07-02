import axios from "axios";
import querystring from "querystring";

// Websocket
let binanceBRL = new WebSocket("wss://stream.binance.com:9443/ws/btcbrl@trade");
let binanceUSD = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@trade"
);
let lastPriceUsd;
let lastPriceBrl;

export const getBtc = (element) => {
  if (element.id === "brl") {
    binanceBRL.onmessage = (event) => {
      const jsonData = JSON.parse(event.data);
      const price = jsonData.p;

      element.innerText = parseFloat(price).toFixed(2);

      element.style = lastPriceBrl > price ? "color: red" : "color: green";

      lastPriceBrl = price;
    };
  }
  if (element.id === "usd") {
    binanceUSD.onmessage = (event) => {
      const jsonData = JSON.parse(event.data);
      const price = jsonData.p;

      element.innerText = parseFloat(price).toFixed(2);

      element.style = lastPriceUsd > price ? "color: red" : "color: green";

      lastPriceUsd = price;
    };
  }
};

// Rest
const apiUrl = "https://testnet.binance.vision/api";
const defaultInterval = "15m";
const defaultSymbol = "BTCUSDT";
const defaultLimit = 120 * 2;

const publicCall = async (path, data, method = "GET") => {
  try {
    const qs = data ? `?${querystring.stringify(data)}` : "";
    const result = await axios({
      method,
      url: `${apiUrl}${path}${qs}`,
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const klines = async (
  symbol = defaultSymbol,
  limit = defaultLimit,
  interval = defaultInterval
) => {
  const upperCaseSym = symbol.toUpperCase();
  console.log("klines ping");
  const call = await publicCall("/v1/klines", {
    symbol: upperCaseSym,
    limit,
    interval,
  });

  const open = [];
  const high = [];
  const low = [];
  const close = [];

  call.map((data) => {
    open.unshift(data[1]);
    high.unshift(data[2]);
    low.unshift(data[3]);
    close.unshift(data[4]);
  });

  return { open: open, high: high, low: low, close: close };
};

import axios from "axios";
import querystring from "querystring";

// Websocket
const binanceBRL = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcbrl@trade"
);
const binanceUSD = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@trade"
);
let lastPriceUsd;
let lastPriceBrl;

export const getBtc = () => {
  // Elements
  const usd = document.getElementById("usd");
  const brl = document.getElementById("brl");

  // websocket call
  binanceBRL.onmessage = (event) => {
    if (brl) {
      const jsonData = JSON.parse(event.data);
      const price = jsonData.p;

      brl.innerText = `R$${parseFloat(price).toFixed(2)}`;

      brl.style = lastPriceBrl > price ? "color: #BC345B" : "color: #37BC34";

      lastPriceBrl = price;
    }
  };

  // websocket call
  binanceUSD.onmessage = (event) => {
    if (usd) {
      const jsonData = JSON.parse(event.data);
      const price = jsonData.p;

      usd.innerText = `$${parseFloat(price).toFixed(2)}`;

      usd.style = lastPriceUsd > price ? "color: #BC345B" : "color: #37BC34";

      lastPriceUsd = price;
    }
  };
};

// Rest
const apiUrl = "https://api.binance.com/api";
const defaultInterval = "4h";
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
    if (error) {
      const glanceBRL = document.getElementById("glance-brl");
      const glanceUSD = document.getElementById("glance-usd");

      if (glanceUSD) {
        glanceUSD.innerHTML = `<span class="danger alert price">Error fetching data, try again later.</span>`;
      }
      if (glanceBRL) {
        glanceBRL.innerHTML = `<span class="danger alert price">Error fetching data, try again later.</span>`;
      }
    }
  }
};

export const klines = async (
  symbol = defaultSymbol,
  limit = defaultLimit,
  interval = defaultInterval
) => {
  const upperCaseSym = symbol.toUpperCase();
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

import axios from "axios";
import * as querystring from "querystring";
import formatCurrency from "../utils/formatCurrency";

// Websocket
const binanceBRL = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcbrl@trade"
);
const binanceUSD = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@trade"
);
let lastPriceUsd: number;
let lastPriceBrl: number;

export const getBtc = () => {
  // Elements
  const usd = document.getElementById("usd") as HTMLHtmlElement;
  const brl = document.getElementById("brl") as HTMLHtmlElement;

  // websocket call
  binanceBRL.onmessage = (event) => {
    if (brl) {
      const jsonData = JSON.parse(event.data);
      const price: number = parseFloat(jsonData.p);

      brl.innerText = formatCurrency("brl", parseFloat(price.toFixed(2)));

      brl.setAttribute(
        "style",
        `${lastPriceBrl > price ? "color: #BC345B" : "color: #37BC34"}`
      );

      lastPriceBrl = price;
    }
  };

  // websocket call
  binanceUSD.onmessage = (event) => {
    if (usd) {
      const jsonData = JSON.parse(event.data);
      const price: number = parseFloat(jsonData.p);

      usd.innerText = formatCurrency("usd", parseFloat(price.toFixed(2)));

      usd.setAttribute(
        "style",
        `${lastPriceUsd > price ? "color: #BC345B" : "color: #37BC34"}`
      );

      lastPriceUsd = price;
    }
  };
};

// Rest
const apiUrl = "https://api.binance.com/api";
const defaultInterval = "4h";
const defaultSymbol = "BTCUSDT";
const defaultLimit = 120 * 2;

const publicCall = async (
  path: string,
  data: { symbol: string; limit: number; interval: string }
): Promise<string[][]> => {
  try {
    const qs = data ? `?${querystring.stringify(data)}` : "";
    const result = await axios.get(`${apiUrl}${path}${qs}`);

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
  symbol: string = defaultSymbol,
  limit: number = defaultLimit,
  interval: string = defaultInterval
): Promise<{
  open: string[];
  high: string[];
  low: string[];
  close: string[];
}> => {
  const upperCaseSym = symbol.toUpperCase();
  const call = await publicCall("/v1/klines", {
    symbol: upperCaseSym,
    limit,
    interval,
  });

  const open: string[] = [];
  const high: string[] = [];
  const low: string[] = [];
  const close: string[] = [];

  call.map((data: string[]) => {
    open.unshift(data[1]);
    high.unshift(data[2]);
    low.unshift(data[3]);
    close.unshift(data[4]);
  });

  return { open: open, high: high, low: low, close: close };
};

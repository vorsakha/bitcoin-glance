import { getBtc } from "../Controller/Api/binanceData.js";
import { getSignal } from "../Controller/Signal/signal.js";

// Content
const usd = document.getElementById("usd");
const brl = document.getElementById("brl");
const btn = document.getElementById("signal-btn");

// Get Binance Data
getBtc(usd);
getBtc(brl);

const handleSignal = (fiat) => {
  if (fiat === "btcusdt") {
    getSignal(fiat);
    btn.innerText = "loading...";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = "Update signal";
      btn.disabled = false;
    }, 3000);
  }

  if (fiat === "btcbrl") {
    getSignal(fiat);
    btn.innerText = "loading...";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = "Update signal";
      btn.disabled = false;
    }, 3000);
  }
};

btn.onclick = () => handleSignal("btcusdt");

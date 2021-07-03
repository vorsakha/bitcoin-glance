import { getBtc } from "../Controller/Api/binanceData.js";
import { handleSignal } from "../Controller/Signal/signal.js";
import countdown from "../Controller/Signal/utils/countdown.js";
let currency = "btcusdt";

// Content
const usd = document.getElementById("usd");
const footer = document.getElementById("footer");
const brl = document.getElementById("brl");
const signalBtn = document.getElementById("signal-btn");
const signalContainer = document.getElementById("signal-container");
const currencyUsd = document.getElementById("currency-usd");
const currencyBrl = document.getElementById("currency-brl");
const price = document.getElementById("current-price");

const year = new Date().getFullYear();

footer.innerText = `©${year} Andrei T. Ferreira. All rights reserved.`;

// Get Binance data at render time
getBtc();
// Get glance
handleSignal();
// Set timer
const timerElement = document.getElementById("timer");
countdown(60 * 5, timerElement);

// onclick functions
signalBtn.onclick = () => handleSignal();

// TIMER BUG

import { getBtc } from "../Controller/Api/binanceData.js";
import { handleSignal } from "../Controller/Signal/signal.js";

// Content
const footer = document.getElementById("footer");
const signal4h = document.getElementById("signal-4h");
const signal1d = document.getElementById("signal-1d");
const signal1w = document.getElementById("signal-1w");

const year = new Date().getFullYear();

footer.innerText = `©${year} Andrei T. Ferreira. All rights reserved.`;

// Get websocket Binance data
getBtc();
// Get glance
handleSignal();

// onclick functions
signal4h.onclick = () => handleSignal("4h");
signal1d.onclick = () => handleSignal("1d");
signal1w.onclick = () => handleSignal("1w");

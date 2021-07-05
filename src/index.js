import { getBtc } from "./Controller/Api/binanceData.js";
import { handleSignal } from "./Controller/Signal/signal.js";
import "./View/footer.js";
import "./View/styles/index.css";

// Content
const signal4h = document.getElementById("signal-4h");
const signal1d = document.getElementById("signal-1d");
const signal1w = document.getElementById("signal-1w");

// Get websocket Binance data
getBtc();
// Get glance
handleSignal("4h");

// onclick functions
signal4h.onclick = () => handleSignal("4h");
signal1d.onclick = () => handleSignal("1d");
signal1w.onclick = () => handleSignal("1w");
